import { Beaker, Cylinder, Droplet, FileText, Minus, Package, Paperclip, Pencil, Scissors } from 'lucide-react'

export function getMaterialIcon(material) {
  const value = material.toLowerCase()

  if (/toilet paper|paper roll|cardboard tube|\btube\b/.test(value)) return Cylinder
  if (/scissor/.test(value)) return Scissors
  if (/glue/.test(value)) return Droplet
  if (/tape/.test(value)) return Paperclip
  if (/marker|crayon|pen|pencil/.test(value)) return Pencil
  if (/paper|cardstock|card\b/.test(value)) return FileText
  if (/water/.test(value)) return Droplet
  if (/bowl|cup|container|jar|bottle/.test(value)) return Beaker
  if (/string|wool|yarn/.test(value)) return Minus
  if (/box/.test(value)) return Package
  return Package
}
