# Curio design system

## Colour palette

Use the Tailwind theme tokens so Curio screens share the same playful visual language.

| Token | Value | Use |
| --- | --- | --- |
| `rainbow-red` | `#F87171` | Warm, energetic controls |
| `rainbow-orange` | `#FB923C` | Warm, playful controls |
| `rainbow-yellow` | `#FACC15` | Sunny controls and highlights |
| `rainbow-green` | `#4ADE80` | Fresh, nature-inspired controls |
| `rainbow-blue` | `#38BDF8` | Cool controls and focus rings |
| `rainbow-purple` | `#A78BFA` | Imaginative controls and actions |
| `rainbow-pink` | `#F472B6` | Expressive controls and actions |
| `curio-background` | `#FFFBEB` | Base page and neutral surfaces |
| `curio-text` | `#334155` | Default text |

## Spacing and components

- Use `p-6 md:p-10` for page containers and `p-5` for cards.
- Use `space-y-6` between major sections, `gap-4` in control grids, and `mt-4` between a heading and its controls.
- Cycle the rainbow colours across related choice controls. Each control has a tinted version of its assigned colour by default, a fully saturated assigned colour on hover, and a matching full-colour selected state.
- Selected controls use a bolder border and `scale-105`; use dark text on tinted backgrounds and white text on saturated hover and selected states. Apply `transition-colors duration-200` to these colour changes.
- Primary actions may use a rainbow gradient, with a visible hover lift and a `rainbow-blue` focus ring.
- For content-heavy screens, use a two-column layout at `md` and above: a primary column stacks smaller cards with `space-y-6`, while the secondary column holds one featured card that stretches to the primary column's height. Stack the columns vertically on smaller screens.
