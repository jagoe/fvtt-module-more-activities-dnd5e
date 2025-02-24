import * as fsPromises from 'node:fs/promises'
import * as path from 'node:path'
import copy from 'rollup-plugin-copy'
import scss from 'rollup-plugin-scss'
import { defineConfig, Plugin } from 'vite'

const moduleVersion = process.env.MODULE_VERSION
const githubProject = process.env.GH_PROJECT
const githubTag = process.env.GH_TAG

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      input: ['src/ts/module.ts'],
      output: {
        dir: 'dist',
        entryFileNames: 'scripts/[name].js',
        format: 'es',
      },
    },
  },
  plugins: [
    updateModuleManifestPlugin(),
    scss({
      fileName: 'style.css',
      sourceMap: false,
      watch: ['src/styles/*.scss'],
    }),
    copy({
      targets: [{ src: 'src/languages', dest: 'dist' }],
      hook: 'writeBundle',
    }),
    addWatchedFilesPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/ts'),
      '@languages': path.resolve(__dirname, './languages'),
    },
  },
})

function addWatchedFilesPlugin(): Plugin {
  return {
    name: 'add-watched-files',
    async buildStart() {
      this.addWatchFile('src/module.json')

      const translations = await fsPromises.readdir('src/languages')
      translations.forEach((file) => {
        this.addWatchFile(`src/languages/${file}`)
      })
    },
  }
}

function updateModuleManifestPlugin(): Plugin {
  return {
    name: 'update-module-manifest',
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(await fsPromises.readFile('./package.json', 'utf-8')) as Record<
        string,
        unknown
      >
      const version = moduleVersion || (packageContents.version as string)
      const manifestContents: string = await fsPromises.readFile('src/module.json', 'utf-8')
      const manifestJson = JSON.parse(manifestContents) as Record<string, unknown>
      manifestJson['version'] = version
      if (githubProject) {
        const baseUrl = `https://github.com/${githubProject}/releases`
        manifestJson['manifest'] = `${baseUrl}/latest/download/module.json`
        if (githubTag) {
          manifestJson['download'] = `${baseUrl}/download/${githubTag}/module.zip`
        }
      }
      await fsPromises.writeFile('dist/module.json', JSON.stringify(manifestJson, null, 4))
    },
  }
}
