package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// typedefTransformer transforms Haxe typedef keyword to TypeScript type keyword
// This allows Haxe-style type aliases:
//   typedef Point = { x: number; y: number; }
// to be converted to TypeScript:
//   type Point = { x: number; y: number; }
type typedefTransformer struct {
	transformers.Transformer
}

func (tx *typedefTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	// Transform typedef keyword to type keyword
	// This happens at the token level in type alias declarations
	switch node.Kind {
	case ast.KindTypedefKeyword:
		// Simply change typedef to type keyword
		node.Kind = ast.KindTypeKeyword
		return node
	}

	// Visit children for other nodes
	return tx.Visitor().VisitEachChild(node)
}

func newTypedefTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &typedefTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}