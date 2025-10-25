package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// switchPatternTransformer transforms switch statements with ADT enum pattern matching
// Transforms: switch (color) { case Rgb(r,g,b): ... }
// Into: switch (color._tag) { case "Rgb": const {r,g,b} = color; ... }
type switchPatternTransformer struct {
	transformers.Transformer
}

func (tx *switchPatternTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	switch node.Kind {
	case ast.KindSwitchStatement:
		return tx.visitSwitchStatement(node.AsSwitchStatement())
	default:
		return tx.Visitor().VisitEachChild(node)
	}
}

func (tx *switchPatternTransformer) visitSwitchStatement(node *ast.SwitchStatement) *ast.Node {
	if node.CaseBlock == nil {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	caseBlock := node.CaseBlock.AsCaseBlock()
	if caseBlock == nil || caseBlock.Clauses == nil {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Check if any case clause uses ADT pattern matching (CallExpression in case)
	needsTransform := false
	for _, clause := range caseBlock.Clauses.Nodes {
		if clause.Kind == ast.KindCaseClause {
			caseClause := clause.AsCaseOrDefaultClause()
			if caseClause != nil && caseClause.Expression != nil {
				if caseClause.Expression.Kind == ast.KindCallExpression {
					needsTransform = true
					break
				}
			}
		}
	}

	if !needsTransform {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Transform the switch: replace expression with expression._tag
	factory := tx.Factory()
	
	// Create: switchExpr._tag
	tagAccess := factory.NewPropertyAccessExpression(
		node.Expression,
		nil, // questionDotToken
		factory.NewIdentifier("_tag"),
		0, // flags
	)

	// Transform case clauses
	newClauses := make([]*ast.Node, 0, len(caseBlock.Clauses.Nodes))

	for _, clause := range caseBlock.Clauses.Nodes {
		if clause.Kind == ast.KindDefaultClause {
			newClauses = append(newClauses, clause)
			continue
		}

		caseClause := clause.AsCaseOrDefaultClause()
		if caseClause == nil {
			newClauses = append(newClauses, clause)
			continue
		}

		pattern := caseClause.Expression
		if pattern == nil {
			newClauses = append(newClauses, clause)
			continue
		}

		// Transform pattern
		if pattern.Kind == ast.KindCallExpression {
			// Pattern like: Rgb(r, g, b) -> transform to "Rgb" + destructuring
			transformedClause := tx.transformPatternCase(caseClause, node.Expression)
			newClauses = append(newClauses, transformedClause)
		} else if pattern.Kind == ast.KindIdentifier {
			// Simple pattern like: Red -> transform to "Red"
			ident := pattern.AsIdentifier()
			if ident != nil {
				newExpression := factory.NewStringLiteral(ident.Text)
				newClause := factory.NewCaseOrDefaultClause(
					ast.KindCaseClause,
					newExpression,
					caseClause.Statements,
				)
				newClauses = append(newClauses, newClause)
			} else {
				newClauses = append(newClauses, clause)
			}
		} else {
			// Not a pattern, keep as is
			newClauses = append(newClauses, clause)
		}
	}

	// Create new case block
	newCaseBlock := factory.NewCaseBlock(factory.NewNodeList(newClauses))

	// Create new switch statement with modified expression
	return factory.NewSwitchStatement(tagAccess, newCaseBlock)
}

// transformPatternCase transforms a case with pattern destructuring
// case Rgb(r, g, b): statements
// becomes:
// case "Rgb":
//   const {r, g, b} = switchValue;
//   statements
func (tx *switchPatternTransformer) transformPatternCase(caseClause *ast.CaseOrDefaultClause, switchExpr *ast.Node) *ast.Node {
	pattern := caseClause.Expression
	if pattern == nil || pattern.Kind != ast.KindCallExpression {
		return caseClause.AsNode()
	}

	callExpr := pattern.AsCallExpression()
	if callExpr == nil || callExpr.Expression == nil {
		return caseClause.AsNode()
	}

	factory := tx.Factory()

	// Get pattern name from call expression
	var patternName string
	if callExpr.Expression.Kind == ast.KindIdentifier {
		ident := callExpr.Expression.AsIdentifier()
		if ident != nil {
			patternName = ident.Text
		}
	}

	if patternName == "" {
		return caseClause.AsNode()
	}

	// Create: case "PatternName":
	newExpression := factory.NewStringLiteral(patternName)

	// Create destructuring statement if there are arguments
	var newStatements *ast.NodeList
	if callExpr.Arguments != nil && len(callExpr.Arguments.Nodes) > 0 {
		destructuringStmt := tx.createDestructuringStatement(callExpr.Arguments.Nodes, switchExpr)
		if destructuringStmt != nil {
			// Prepend destructuring to statements
			stmtNodes := append([]*ast.Node{destructuringStmt}, caseClause.Statements.Nodes...)
			newStatements = factory.NewNodeList(stmtNodes)
		} else {
			newStatements = caseClause.Statements
		}
	} else {
		newStatements = caseClause.Statements
	}

	// Create new case clause
	return factory.NewCaseOrDefaultClause(ast.KindCaseClause, newExpression, newStatements)
}

// createDestructuringStatement creates: const {arg1, arg2, ...} = switchValue;
func (tx *switchPatternTransformer) createDestructuringStatement(args []*ast.Node, switchExpr *ast.Node) *ast.Node {
	factory := tx.Factory()

	// Create binding elements for each argument
	bindings := make([]*ast.Node, 0, len(args))
	for _, arg := range args {
		if arg.Kind == ast.KindIdentifier {
			ident := arg.AsIdentifier()
			if ident != nil {
				binding := factory.NewBindingElement(
					nil, // dotdotdot
					nil, // propertyName
					factory.NewIdentifier(ident.Text),
					nil, // initializer
				)
				bindings = append(bindings, binding)
			}
		}
	}

	if len(bindings) == 0 {
		return nil
	}

	// Create object binding pattern: {arg1, arg2}
	bindingPattern := factory.NewBindingPattern(ast.KindObjectBindingPattern, factory.NewNodeList(bindings))

	// Create variable declaration: const {arg1, arg2} = switchValue
	varDecl := factory.NewVariableDeclaration(
		bindingPattern,
		nil,        // exclamationToken
		nil,        // type
		switchExpr, // initializer
	)

	// Create variable declaration list
	varDeclList := factory.NewVariableDeclarationList(
		ast.NodeFlagsConst,
		factory.NewNodeList([]*ast.Node{varDecl}),
	)

	// Create variable statement
	return factory.NewVariableStatement(nil, varDeclList)
}

func newSwitchPatternTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &switchPatternTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}