import * as fs from 'fs'
import * as path from 'path'
import * as matter from 'gray-matter'
import { marked } from 'marked'
import * as prettier from 'prettier'


const postsDir = path.resolve(__dirname, '../posts')
const pagesDir = path.resolve(__dirname, '../src/pages/generatedPosts')
const utilsDir = path.resolve(__dirname, '../src/utils')

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true })
}

const files = fs.readdirSync(postsDir)

// This relies on knowing the folder structure of the project
let routesContent = `import { blogPost } from '../pages/blogPost'\n\n`
const postsMetadata = {}

async function buildPosts() {
  files.forEach(async (file) => {
    const filePath = path.join(postsDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { content, data } = matter(fileContent)

    const htmlContent = marked(content)
    const componentName = path.basename(file, '.md')

    const componentTemplate = `
      export default function ${componentName}() {
          return (
              <div>
                <article class="prose">${htmlContent}</article>
              </div>
          )
      }
    `

    // This again relies on the folder structure of the project which i dont like
    routesContent += `import ${componentName} from '../pages/generatedPosts/${componentName}'\n`

    postsMetadata[componentName] = data

    const formattedComponentTemplate = await prettier.format(componentTemplate, {
      parser: 'typescript',
      singleQuote: true,
      semi: false,
    })

    fs.writeFileSync(path.join(pagesDir, `${componentName}.tsx`), formattedComponentTemplate)
  })

  routesContent += `
  export const blogRoutes = [
  ${files.map(file => {
    const componentName = path.basename(file, '.md')
    return `{ path: '/blog/${postsMetadata[componentName].slug}', component: () => blogPost({ blogComponent: ${componentName} }) },`
  }).join(',\n')}
  ]
  `

  const formattedRoutesContent = await prettier.format(routesContent, {
    parser: 'typescript',
    singleQuote: true,
    semi: false,
  })

  fs.writeFileSync(path.resolve(utilsDir, 'blogRoutes.ts'), formattedRoutesContent)

  const metadataContent = `
  const postsMetadata = ${JSON.stringify(postsMetadata)}
  export default postsMetadata
  `

  const formattedMetadataContent = await prettier.format(metadataContent, {
    parser: 'typescript',
    singleQuote: true,
    semi: false,
  })

  fs.writeFileSync(path.resolve(utilsDir, 'postsMetadata.ts'), formattedMetadataContent)
}

buildPosts()