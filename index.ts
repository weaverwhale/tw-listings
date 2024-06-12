import { readFileSync } from 'fs'
import * as ts from 'typescript'
import { getExportsForSourceFile } from './get-exports-for-source-file'
import { traverseFolder } from './traverse-folder'

const folderNames = process.argv.slice(2)
console.log(`Folder names: ${folderNames}`)

folderNames.forEach((folderName) => {
  traverseFolder(folderName, (fileName: any) => {
    // Parse a file
    const sourceFile = ts.createSourceFile(
      fileName,
      readFileSync(fileName).toString(),
      ts.ScriptTarget.ES2022,
      /*setParentNodes */ true,
    )

    const allExports = getExportsForSourceFile(sourceFile)
    console.log(fileName)
    console.log(allExports)
  })
})
