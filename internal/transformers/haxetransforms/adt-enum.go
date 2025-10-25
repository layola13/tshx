package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// adtEnumTransformer transforms Haxe-style ADT enums to JavaScript objects with factory functions
type adtEnumTransformer struct {
	transformers.Transformer
}

func (tx *adtEnumTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	switch node.Kind {
	case ast.KindEnumDeclaration:
		return tx.visitEnumDeclaration(node.AsEnumDeclaration())
	default:
		return tx.Visitor().VisitEachChild(node)
	}
}

func (tx *adtEnumTransformer) visitEnumDeclaration(node *ast.EnumDeclaration) *ast.Node {
	// Check if this is an ADT enum (has members with parameters)
	hasADTMembers := false
	if node.Members != nil {
		for _, member := range node.Members.Nodes {
			if enumMember := member.AsEnumMember(); enumMember != nil {
				if enumMember.Parameters != nil && len(enumMember.Parameters.Nodes) > 0 {
					hasADTMembers = true
					break
				}
			}
		}
	}

	// If not an ADT enum, return as-is
	if !hasADTMembers {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// Transform to ADT enum: create an object with factory functions
	// enum Color { Red; Green; Rgb(r: Int, g: Int, b: Int); }
	// becomes:
	// const Color = {
	//   Red: () => ({ _tag: 'Red' }),
	//   Green: () => ({ _tag: 'Green' }),
	//   Rgb: (r, g, b) => ({ _tag: 'Rgb', r, g, b })
	// };

	factory := tx.Factory()
	
	// Create property assignments for each enum member
	var properties []*ast.Node
	if node.Members != nil {
		for _, member := range node.Members.Nodes {
			enumMember := member.AsEnumMember()
			if enumMember == nil {
				continue
			}

			memberName := enumMember.Name()
			var memberNameStr string
			if ast.IsIdentifier(memberName) {
				memberNameStr = memberName.AsIdentifier().Text
			} else {
				// Skip non-identifier names for now
				continue
			}

			// Create factory function for this member
			var parameters []*ast.Node
			var objectProperties []*ast.Node
			
			// Always include _tag property
			tagProperty := factory.NewPropertyAssignment(
				nil, // modifiers
				factory.NewIdentifier("_tag"),
				nil, // postfixToken
				nil, // typeNode
				factory.NewStringLiteral(memberNameStr),
			)
			objectProperties = append(objectProperties, tagProperty)

			// Add parameters if present
			if enumMember.Parameters != nil && len(enumMember.Parameters.Nodes) > 0 {
				for _, param := range enumMember.Parameters.Nodes {
					paramDecl := param.AsParameterDeclaration()
					if paramDecl == nil {
						continue
					}
					
					paramName := paramDecl.Name()
					if !ast.IsIdentifier(paramName) {
						continue
					}
					
					paramId := paramName.AsIdentifier()
					
					// Add to function parameters
					parameters = append(parameters, param)
					
					// Add to object properties: { paramName: paramName }
					prop := factory.NewShorthandPropertyAssignment(
						nil, // modifiers
						factory.NewIdentifier(paramId.Text),
						nil, // questionToken
						nil, // typeNode
						nil, // exclamationToken
						nil, // objectAssignmentInitializer
					)
					objectProperties = append(objectProperties, prop)
				}
			}

			// Create object literal: { _tag: 'MemberName', param1, param2, ... }
			objectLiteral := factory.NewObjectLiteralExpression(
				factory.NewNodeList(objectProperties),
				false, // multiLine
			)

			// Create arrow function: (params) => ({ ... })
			arrowFunc := factory.NewArrowFunction(
				nil,                        // modifiers
				nil,                        // typeParameters
				factory.NewNodeList(parameters), // parameters
				nil,                        // type
				nil,                        // fullSignature
				factory.NewToken(ast.KindEqualsGreaterThanToken),
				objectLiteral,
			)

			// Create property: MemberName: (params) => ({ ... })
			property := factory.NewPropertyAssignment(
				nil, // modifiers
				factory.NewIdentifier(memberNameStr),
				nil, // postfixToken
				nil, // typeNode
				arrowFunc,
			)
			
			properties = append(properties, property)
		}
	}

	// Create: const EnumName = { ... };
	objectLiteral := factory.NewObjectLiteralExpression(
		factory.NewNodeList(properties),
		false, // multiLine
	)
	
	varDecl := factory.NewVariableDeclaration(
		node.Name(),
		nil, // exclamationToken
		nil, // type
		objectLiteral,
	)
	
	varDeclList := factory.NewVariableDeclarationList(
		ast.NodeFlagsConst,
		factory.NewNodeList([]*ast.Node{varDecl}),
	)
	
	varStatement := factory.NewVariableStatement(
		nil, // modifiers
		varDeclList,
	)

	return varStatement
}

func newADTEnumTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &adtEnumTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}