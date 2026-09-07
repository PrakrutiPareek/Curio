import { generateBundleHandler } from '../lib/curio-api.js'

export default function handler(req, res) {
  return generateBundleHandler(req, res)
}
