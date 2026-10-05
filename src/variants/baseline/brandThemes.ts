export const brandThemes = ['rust', 'pine', 'slate'] as const

export type BrandTheme = (typeof brandThemes)[number]

export const brandThemeMeta: Record<
  BrandTheme,
  { label: string; summary: string }
> = {
  rust: {
    label: 'Rust — warm & tactile',
    summary:
      'Human warmth on chalk neutrals. Rust and Ochre carry interaction; Pine and Sage support success states.',
  },
  pine: {
    label: 'Pine — calm & structural',
    summary:
      'Botanical structure on limestone neutrals. Pine and Sage lead; Rust and Ochre appear only for contrast and warnings.',
  },
  slate: {
    label: 'Slate — cool & precise',
    summary:
      'Mineral clarity on chalk neutrals. Slate and Glacier carry interaction; Pine handles success; warmth is reserved for warnings.',
  },
}

export const brandThemeLabels: Record<BrandTheme, string> = Object.fromEntries(
  brandThemes.map((theme) => [theme, brandThemeMeta[theme].label]),
) as Record<BrandTheme, string>
