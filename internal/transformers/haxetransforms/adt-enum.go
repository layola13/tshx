package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// adtEnumTransformer is a placeholder for ADT enum support
// For now, it just passes through without transformation
// Full ADT enum support requires extensive AST modifications
type adtEnumTransformer struct {
	transformers.Transformer
}

func (tx *adtEnumTransformer) visit(node *ast.Node) *ast.Node {
	// For now, just pass through
	// ADT enums can be implemented using standard TypeScript patterns
	return tx.Visitor().VisitEachChild(node)
}

func newADTEnumTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &adtEnumTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}