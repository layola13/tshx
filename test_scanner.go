package main

import (
	"fmt"
	"github.com/microsoft/typescript-go/internal/ast"
	"github.com/microsoft/typescript-go/internal/scanner"
)

func main() {
	code := "for (let i in 0...10) {}"
	s := scanner.NewScanner()
	s.SetText(code)
	
	fmt.Println("Scanning:", code)
	fmt.Println("Tokens:")
	
	for {
		s.Scan()
		token := s.Token()
		if token == ast.KindEndOfFile {
			break
		}
		text := s.TokenText()
		fmt.Printf("  Token: %v (%s), Text: %q\n", token, token.String(), text)
	}
}