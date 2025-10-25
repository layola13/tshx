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

func (tx *rangeTransformer) visitForInStatement(node *ast.ForInOrOfStatement) *ast.Node {
	// Check if the expression is a BinaryExpression with DotDotDotToken
	if !ast.IsBinaryExpression(node.Expression) {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	binary := node.Expression.AsBinaryExpression()
	
	// Check for range operators (... only, since .. is not defined)
	isExclusiveRange := binary.OperatorToken.Kind == ast.KindDotDotDotToken
	
	if !isExclusiveRange {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Transform: for (let i in start...end) { body }
	// Into: for (let i = start; i < end; i++) { body }

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

	// Create condition: i < end
	condition := factory.NewBinaryExpression(
		nil, // modifiers
		varDecl.Name().Clone(factory),
		nil, // type
		factory.NewToken(ast.KindLessThanToken),
		tx.Visitor().VisitNode(binary.Right),
	)

	// Create incrementor: i++
	incrementor := factory.NewPostfixUnaryExpression(
		varDecl.Name().Clone(factory),
		ast.KindPlusPlusToken,
	)

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