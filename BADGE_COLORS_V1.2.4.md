# 🎨 Badge Colors - Lead Sources

## Implementação Concluída

As cores dos badges de origem dos leads foram atualizadas conforme especificação:

### Cores por Source

| Source | Badge | Cor | Hex | Preview |
|--------|-------|-----|-----|---------|
| **IA** | 🤖 IA | Verde Claro | `#10B981` | ![#10B981](https://via.placeholder.com/50x20/10B981/FFFFFF?text=IA) |
| **MANUAL** | 🖊️ MANUAL | Azul Claro | `#60A5FA` | ![#60A5FA](https://via.placeholder.com/50x20/60A5FA/FFFFFF?text=MANUAL) |

### Implementação Técnica

#### 1. Componente Badge (`src/components/ui/Badge.jsx`)

Adicionados dois novos tipos de badge:

```jsx
const styles = {
  // ... outros tipos existentes
  ia: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20", // Verde claro
  manual: "bg-[#60A5FA]/10 text-[#60A5FA] border-[#60A5FA]/20", // Azul claro
};
```

#### 2. FunnelView (`src/views/FunnelView.jsx`)

Adicionada função helper para mapear source → tipo de badge:

```jsx
const getLeadSourceBadgeType = (source) => {
  if (source === 'manual') return 'manual';
  if (source === 'ia') return 'ia';
  return 'neutral';
};
```

Atualizado o render do Badge:

```jsx
<Badge type={getLeadSourceBadgeType(lead.source)}>
  <span className="text-[10px]">{getLeadSourceLabel(lead.source)}</span>
</Badge>
```

### Detalhes das Cores

#### Badge IA (Verde Claro)
- **Cor do texto**: `#10B981` (Emerald 500)
- **Background**: `#10B981` com 10% de opacidade
- **Border**: `#10B981` com 20% de opacidade
- **Visual**: Verde claro vibrante, associado com tecnologia/automação

#### Badge MANUAL (Azul Claro)
- **Cor do texto**: `#60A5FA` (Blue 400)
- **Background**: `#60A5FA` com 10% de opacidade
- **Border**: `#60A5FA` com 20% de opacidade
- **Visual**: Azul claro suave, associado com interação humana

### Extensibilidade

O sistema de badges está preparado para receber novos sources:

```jsx
// Para adicionar novo source, basta:
// 1. Adicionar estilo no Badge.jsx
whatsapp: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",

// 2. Adicionar mapeamento no FunnelView.jsx
if (source === 'whatsapp') return 'whatsapp';
```

### Outros Sources Disponíveis

Para referência futura, outros sources mapeados no sistema:

| Source | Sugestão de Cor | Hex |
|--------|-----------------|-----|
| `whatsapp` | Verde WhatsApp | `#25D366` |
| `facebook` | Azul Facebook | `#1877F2` |
| `instagram` | Rosa/Gradiente | `#E4405F` |
| `google` | Vermelho Google | `#EA4335` |
| `site` | Cinza | `#64748B` |
| `indicacao` | Amarelo | `#F59E0B` |

## Testing

Para testar as novas cores:

1. Execute os scripts de teste:
```bash
./test-create-lead-ia.sh      # Cria lead IA com badge verde
./test-create-lead-manual.sh  # Cria lead MANUAL com badge azul
```

2. Abra o CRM no FunnelView
3. Verifique os badges coloridos nos cards dos leads

## Commits

```
71d10c7 - feat: update badge colors for IA (green) and MANUAL (blue) sources
```

## Design System

As cores seguem o padrão de design do Tailwind:
- Usa cores da paleta padrão para consistência
- Opacity de 10% no background para suavidade
- Opacity de 20% no border para definição
- Texto em cor sólida para máxima legibilidade

## Dark Mode

As cores foram escolhidas para funcionar bem no tema dark atual do CRM:
- ✅ Bom contraste com background `#0F172A`
- ✅ Harmonia com outros elementos da UI
- ✅ Acessibilidade WCAG AA+

---

**Status**: ✅ Implementado e commitado
**Versão**: v1.2.4
**Data**: 2026-01-03

