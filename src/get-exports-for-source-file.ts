import * as ts from 'typescript'

export function getExportsForSourceFile(sourceFile: ts.SourceFile) {
  const allExports: { type: string; name: string }[] = []

  visitNode(sourceFile)

  function visitNode(node: ts.Node) {
    if (ts.isExportSpecifier(node)) {
      const name = node.name.getText()
      // console.log('export specifier', name);
      allExports.push({ type: 'specifier', name })
    } else if (node.kind === ts.SyntaxKind.ExportKeyword) {
      const parent = node.parent
      if (
        ts.isFunctionDeclaration(parent) ||
        ts.isTypeAliasDeclaration(parent) ||
        ts.isInterfaceDeclaration(parent)
      ) {
        const name = parent?.name?.getText() ?? ''
        // console.log('export function', name);
        allExports.push({ type: 'function', name })
      } else if (ts.isVariableStatement(parent)) {
        parent.declarationList.declarations.forEach((declaration) => {
          const name = declaration.name.getText()
          // console.log('export var', name);
          allExports.push({ type: 'var', name })
        })
      } else if (ts.isClassDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        // console.log('export class', name);
        allExports.push({ type: 'class', name })
      } else if (ts.isTypeAliasDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        // console.log('export type alias', name);
        allExports.push({ type: 'type', name })
      } else if (ts.isEnumDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        // console.log('export enum', name);
        allExports.push({ type: 'enum', name })
      } else if (ts.isModuleDeclaration(parent)) {
        const name = parent.name?.getText() ?? ''
        // console.log('export module', name);
        allExports.push({ type: 'module', name })
      }
    }

    ts.forEachChild(node, visitNode)
  }

  return { file: sourceFile.fileName, exports: allExports }
}
