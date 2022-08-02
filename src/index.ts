#!/usr/bin/env node

import { mkdir, stat, unlink } from 'node:fs/promises'
import { join } from 'node:path'
import files from '@unvented/files'
import minimist from 'minimist'

(async () => {
  const argv = minimist(process.argv.slice(2))

  const stats = async (path: string) => {
    try {
      const s = await stat(path)
  
      return s
    } catch (err) {
      return undefined
    }
  }

  for (let directory of argv._) {
    directory = join(process.cwd(), directory.startsWith('./') ? directory : `./${directory}`)

    if (!(await stats(directory))?.isDirectory())
      await mkdir(directory, {
        recursive: true
      })
    else
      for await (const file of files(directory))
        await unlink(file)
  }
})()
