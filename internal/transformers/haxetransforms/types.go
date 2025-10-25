package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// haxeTypesTransformer transforms Haxe type keywords to TypeScript equivalents
// Haxe type mapping:
// - Int -> number
// - Float -> number
// - Bool -> boolean
// - Dynamic -> any
// - String -> string (unchanged)
type haxeTypesTransformer struct {
	transformers.Transformer
}

func (tx *haxeTypesTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	// Transform Haxe type keywords to TypeScript type keywords
	switch node.Kind {
	case ast.KindIntKeyword, ast.KindFloatKeyword:
		// Int and Float both map to TypeScript's number
		node.Kind = ast.KindNumberKeyword
		return node
	
	case ast.KindBoolKeyword:
		// Bool maps to TypeScript's boolean
		node.Kind = ast.KindBooleanKeyword
		return node
	
	case ast.KindDynamicKeyword:
		// Dynamic maps to TypeScript's any
		node.Kind = ast.KindAnyKeyword
		return node
	}

	// Visit children for other nodes
	return tx.Visitor().VisitEachChild(node)
}

func newHaxeTypesTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &haxeTypesTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}