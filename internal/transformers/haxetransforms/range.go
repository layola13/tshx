package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// rangeTransformer transforms Haxe-style range syntax into standard JavaScript loops
type rangeTransformer struct {
	transformers.Transformer
}

func (tx *rangeTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	switch node.Kind {
	case ast.KindForInStatement:
		return tx.visitForInStatement(node.AsForInOrOfStatement())
	default:
		return tx.Visitor().VisitEachChild(node)
	}
}

// Helper function to unwrap ParenthesizedExpression
func unwrapParenthesized(expr *ast.Expression) *ast.Expression {
	for expr != nil && ast.IsParenthesizedExpression(expr) {
		expr = expr.AsParenthesizedExpression().Expression
	}
	return expr
}

func (tx *rangeTransformer) visitForInStatement(node *ast.ForInOrOfStatement) *ast.Node {
	// Check if the expression is a CallExpression with stepBy
	var rangeExpr *ast.Expression
	var stepExpr *ast.Expression
	
	expr := node.Expression
	
	if ast.IsCallExpression(expr) {
		callExpr := expr.AsCallExpression()
		
		// Check if it's a .stepBy() call
		if ast.IsPropertyAccessExpression(callExpr.Expression) {
			propAccess := callExpr.Expression.AsPropertyAccessExpression()
			if ast.IsIdentifier(propAccess.Name()) && propAccess.Name().AsIdentifier().Text == "stepBy" {
				// Extract the range expression (may be wrapped in parentheses)
				rangeExpr = unwrapParenthesized(propAccess.Expression)
				if len(callExpr.Arguments.Nodes) > 0 {
					stepExpr = callExpr.Arguments.Nodes[0]
				}
			}
		}
	} else {
		// No stepBy call, unwrap any parentheses and check for plain range expression
		rangeExpr = unwrapParenthesized(expr)
	}
	
	// Check if rangeExpr is a BinaryExpression with DotDotDotToken
	if rangeExpr == nil || !ast.IsBinaryExpression(rangeExpr) {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	binary := rangeExpr.AsBinaryExpression()
	
	// Check for range operators (... only, since .. is not defined)
	isExclusiveRange := binary.OperatorToken.Kind == ast.KindDotDotDotToken
	
	if !isExclusiveRange {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Transform: for (let i in start...end) { body }
	// Into: for (let i = start; i < end; i++) { body }
	// Or: for (let i in (start...end).stepBy(step)) { body }
	// Into: for (let i = start; i < end; i += step) { body }

	factory := tx.Factory()
	
	// Get the loop variable
	var loopVar *ast.Node
	if ast.IsVariableDeclarationList(node.Initializer) {
		declList := node.Initializer.AsVariableDeclarationList()
		if len(declList.Declarations.Nodes) > 0 {
			loopVar = declList.Declarations.Nodes[0]
		}
	}
	
	if loopVar == nil {
		// If we can't extract the loop variable, fall back to original behavior
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Create initializer: let i = start
	varDecl := loopVar.AsVariableDeclaration()
	initializer := factory.NewVariableDeclarationList(
		ast.NodeFlagsLet,
		factory.NewNodeList([]*ast.Node{
			factory.NewVariableDeclaration(
				varDecl.Name(),
				nil, // exclamationToken
				nil, // type
				tx.Visitor().VisitNode(binary.Left),
			),
		}),
	)

	// Determine if we need < or > based on step direction
	// For negative steps, we need i > end, for positive steps i < end
	var conditionOp ast.Kind = ast.KindLessThanToken
	var isNegativeStep bool
	
	// Check if stepExpr is a negative number literal or prefixed with minus
	if stepExpr != nil {
		if ast.IsNumericLiteral(stepExpr) {
			// Check if it's a negative number
			if numLit := stepExpr.AsNumericLiteral(); numLit.Text[0] == '-' {
				isNegativeStep = true
			}
		} else if ast.IsPrefixUnaryExpression(stepExpr) {
			prefixExpr := stepExpr.AsPrefixUnaryExpression()
			if prefixExpr.Operator == ast.KindMinusToken {
				isNegativeStep = true
			}
		}
	}
	
	if isNegativeStep {
		conditionOp = ast.KindGreaterThanToken
	}
	
	// Create condition: i < end (or i > end for negative step)
	condition := factory.NewBinaryExpression(
		nil, // modifiers
		varDecl.Name().Clone(factory),
		nil, // type
		factory.NewToken(conditionOp),
		tx.Visitor().VisitNode(binary.Right),
	)

	// Create incrementor: i++ or i += step
	var incrementor *ast.Expression
	if stepExpr != nil {
		// i += step
		incrementor = factory.NewBinaryExpression(
			nil, // modifiers
			varDecl.Name().Clone(factory),
			nil, // type
			factory.NewToken(ast.KindPlusEqualsToken),
			tx.Visitor().VisitNode(stepExpr),
		)
	} else {
		// i++
		incrementor = factory.NewPostfixUnaryExpression(
			varDecl.Name().Clone(factory),
			ast.KindPlusPlusToken,
		)
	}

	// Visit the statement body
	statement := tx.Visitor().VisitNode(node.Statement)

	// Create the for statement
	forStatement := factory.NewForStatement(
		initializer,
		condition,
		incrementor,
		statement,
	)

	return forStatement
}

func newRangeTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &rangeTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}