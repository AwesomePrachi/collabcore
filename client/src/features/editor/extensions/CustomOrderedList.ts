import { OrderedList } from "@tiptap/extension-ordered-list"

export const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      listStyleType: {
        default: "decimal",
        parseHTML: (element) => element.style.listStyleType || "decimal",
        renderHTML: (attributes) => {
          return { style: `list-style-type: ${attributes.listStyleType}` }
        },
      },
      ...this.parent?.(),
    }
  },
})
