package haxetransforms

import (
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/transformers"
)

// propertyAccessorTransformer transforms Haxe-style property accessors to standard getter/setter methods
type propertyAccessorTransformer struct {
	transformers.Transformer
}

func (tx *propertyAccessorTransformer) visit(node *ast.Node) *ast.Node {
	if node == nil {
		return nil
	}

	switch node.Kind {
	case ast.KindClassDeclaration:
		return tx.visitClassDeclaration(node.AsClassDeclaration())
	default:
		return tx.Visitor().VisitEachChild(node)
	}
}

func (tx *propertyAccessorTransformer) visitClassDeclaration(node *ast.ClassDeclaration) *ast.Node {
	// Check if this class has any Haxe-style property accessors
	hasHaxeAccessors := false
	if node.Members != nil {
		for _, member := range node.Members.Nodes {
			if ast.IsPropertyDeclaration(member) {
				propDecl := member.AsPropertyDeclaration()
				if propDecl.GetAccessor != nil || propDecl.SetAccessor != nil {
					hasHaxeAccessors = true
					break
				}
			}
		}
	}

	// If no Haxe accessors, just visit children normally
	if !hasHaxeAccessors {
		return tx.Visitor().VisitEachChild(node.AsNode())
	}

	// First pass: collect all get_xxx and set_xxx methods
	getterMethods := make(map[string]*ast.MethodDeclaration)
	setterMethods := make(map[string]*ast.MethodDeclaration)
	
	if node.Members != nil {
		for _, member := range node.Members.Nodes {
			if ast.IsMethodDeclaration(member) {
				method := member.AsMethodDeclaration()
				if ast.IsIdentifier(method.Name()) {
					methodName := method.Name().AsIdentifier().Text
					// Check if this is a get_xxx or set_xxx method
					if len(methodName) > 4 && methodName[:4] == "get_" {
						propName := methodName[4:]
						getterMethods[propName] = method
					} else if len(methodName) > 4 && methodName[:4] == "set_" {
						propName := methodName[4:]
						setterMethods[propName] = method
					}
				}
			}
		}
	}

	// Transform class with Haxe accessors
	factory := tx.Factory()
	var newMembers []*ast.Node

	if node.Members != nil {
		for _, member := range node.Members.Nodes {
			if ast.IsPropertyDeclaration(member) {
				propDecl := member.AsPropertyDeclaration()
				if propDecl.GetAccessor != nil || propDecl.SetAccessor != nil {
					// Transform Haxe-style property to getter/setter accessors
					transformed := tx.transformPropertyAccessor(propDecl, getterMethods, setterMethods)
					newMembers = append(newMembers, transformed...)
					continue
				}
			}
			
			// Skip get_xxx and set_xxx methods that have been transformed
			if ast.IsMethodDeclaration(member) {
				method := member.AsMethodDeclaration()
				if ast.IsIdentifier(method.Name()) {
					methodName := method.Name().AsIdentifier().Text
					if len(methodName) > 4 {
						prefix := methodName[:4]
						propName := methodName[4:]
						// Skip if this method was used for a property accessor
						if (prefix == "get_" && getterMethods[propName] != nil) ||
							(prefix == "set_" && setterMethods[propName] != nil) {
							// Check if there's a corresponding property declaration
							hasCorrespondingProp := false
							for _, m := range node.Members.Nodes {
								if ast.IsPropertyDeclaration(m) {
									pd := m.AsPropertyDeclaration()
									if pd.GetAccessor != nil || pd.SetAccessor != nil {
										if ast.IsIdentifier(pd.Name()) && pd.Name().AsIdentifier().Text == propName {
											hasCorrespondingProp = true
											break
										}
									}
								}
							}
							if hasCorrespondingProp {
								continue // Skip this get_xxx or set_xxx method
							}
						}
					}
				}
			}
			
			// Keep other members as-is (visit children)
			newMembers = append(newMembers, tx.Visitor().VisitNode(member))
		}
	}

	// Update class with new members
	updatedMembers := factory.NewNodeList(newMembers)
	return factory.UpdateClassDeclaration(
		node,
		node.Modifiers(),
		node.Name(),
		node.TypeParameters,
		node.HeritageClauses,
		updatedMembers,
	)
}

func (tx *propertyAccessorTransformer) transformPropertyAccessor(propDecl *ast.PropertyDeclaration, getterMethods map[string]*ast.MethodDeclaration, setterMethods map[string]*ast.MethodDeclaration) []*ast.Node {
	factory := tx.Factory()
	var result []*ast.Node

	// Extract accessor mode strings
	getMode := ""
	setMode := ""
	
	if propDecl.GetAccessor != nil {
		if ast.IsIdentifier(propDecl.GetAccessor) {
			getMode = propDecl.GetAccessor.AsIdentifier().Text
		} else {
			// It's a keyword node (get, set, default, never)
			switch propDecl.GetAccessor.Kind {
			case ast.KindGetKeyword:
				getMode = "get"
			case ast.KindSetKeyword:
				getMode = "set"
			case ast.KindDefaultKeyword:
				getMode = "default"
			case ast.KindNeverKeyword:
				getMode = "never"
			}
		}
	}
	if propDecl.SetAccessor != nil {
		if ast.IsIdentifier(propDecl.SetAccessor) {
			setMode = propDecl.SetAccessor.AsIdentifier().Text
		} else {
			// It's a keyword node (get, set, default, never)
			switch propDecl.SetAccessor.Kind {
			case ast.KindGetKeyword:
				setMode = "get"
			case ast.KindSetKeyword:
				setMode = "set"
			case ast.KindDefaultKeyword:
				setMode = "default"
			case ast.KindNeverKeyword:
				setMode = "never"
			}
		}
	}

	propName := propDecl.Name()
	propType := propDecl.Type

	// For computed property names, we can't generate simple getter/setter names
	// Just keep the property as-is for now
	if !ast.IsIdentifier(propName) {
		return []*ast.Node{propDecl.AsNode()}
	}

	propNameStr := propName.AsIdentifier().Text

	// Create getter accessor if mode is 'get' or 'default'
	if getMode == "get" || getMode == "default" {
		// Look for get_xxx method
		getterMethod := getterMethods[propNameStr]
		var body *ast.BlockNode
		if getterMethod != nil && getterMethod.Body != nil {
			// Use the existing method's body
			body = getterMethod.Body
		}
		
		// Create a get accessor declaration with the method body
		getter := factory.NewGetAccessorDeclaration(
			nil,                      // modifiers
			propName,                 // name
			nil,                      // typeParameters
			factory.NewNodeList(nil), // parameters (getter has no params)
			propType,                 // returnType
			nil,                      // fullSignature
			body,                     // body from get_xxx method
		)
		result = append(result, getter)
	}

	// Create setter accessor if mode is 'set' or 'default'
	if setMode == "set" || setMode == "default" {
		// Look for set_xxx method
		setterMethod := setterMethods[propNameStr]
		var body *ast.BlockNode
		if setterMethod != nil && setterMethod.Body != nil {
			// Use the existing method's body
			body = setterMethod.Body
		}
		
		// Create parameter for setter: (value: type)
		valueParam := factory.NewParameterDeclaration(
			nil, // modifiers
			nil, // dotDotDotToken
			factory.NewIdentifier("value"),
			nil, // questionToken
			propType,
			nil, // initializer
		)
		
		// Create a set accessor declaration with the method body
		setter := factory.NewSetAccessorDeclaration(
			nil,                                     // modifiers
			propName,                                // name
			nil,                                     // typeParameters
			factory.NewNodeList([]*ast.Node{valueParam}), // parameters
			nil,                                     // returnType
			nil,                                     // fullSignature
			body,                                    // body from set_xxx method
		)
		result = append(result, setter)
	}

	// If mode is 'never' for both, don't generate anything (property is write-only or read-only via methods)
	if getMode == "never" && setMode == "never" {
		// Don't add anything - the property should not be accessible
	}

	return result
}

func newPropertyAccessorTransformer(opts *transformers.TransformOptions) *transformers.Transformer {
	tx := &propertyAccessorTransformer{}
	return tx.NewTransformer(tx.visit, opts.Context)
}