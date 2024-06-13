import * as ts from 'typescript'

export function getExportsForSourceFile(sourceFile: ts.SourceFile) {
  const allExports: { type: string; name: string; parameters?: any[] }[] = []

  visitNode(sourceFile)

  function visitNode(node: ts.Node) {
    if (ts.isExportSpecifier(node)) {
      const name = node.name.getText()
      allExports.push({ type: 'specifier', name })
    } else if (node.kind === ts.SyntaxKind.ExportKeyword) {
      const parent = node.parent
      if (ts.isFunctionDeclaration(parent)) {
        const name = parent?.name?.getText() ?? ''
        const parameters = parent.parameters.map((param) => {
          return {
            name: param.name.getFullText().trim(),
            type: param.type?.getFullText().trim() ?? 'any',
          }
        })
        allExports.push({ type: 'function', name, parameters })
      } else if (ts.isVariableStatement(parent)) {
        parent.declarationList.declarations.forEach((declaration) => {
          const name = declaration.name.getFullText()
          const type = declaration.type?.getFullText().trim() ?? 'any'
          allExports.push({ name, type })
        })
      } else if (ts.isClassDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        const type =
          parent.heritageClauses
            ?.map((clause) => {
              return clause.types.map((type) => type.expression.getText())
            })
            .toString() ?? 'any'
        allExports.push({ name, type })
      } else if (ts.isTypeAliasDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        const type = parent.type?.getFullText().trim() ?? 'alias'
        allExports.push({ name, type })
      } else if (ts.isEnumDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        allExports.push({ type: 'enum', name })
      } else if (ts.isModuleDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        const type = parent.body?.getText() ?? 'module'
        allExports.push({ name, type })
      } else if (ts.isInterfaceDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        allExports.push({ name, type: 'interface' })
      } else if (ts.isNamespaceExportDeclaration(parent)) {
        const name = parent.name.getText()
        allExports.push({ name, type: 'namespace' })
      }
    }

    ts.forEachChild(node, visitNode)
  }

  return { file: sourceFile.fileName, exports: allExports }
}
