# `<smart-search>` Component

A customizable Lit component for building a robust search input with features like debounced searching, dynamic results dropdown, filtering, and accessibility enhancements.

---

## 📦 Installation (Need to register with NPM)

- clone the entire code
- make sure you have latest node installed
- npm i
- npm run dev
- you can check the demo in http://localhost:3000/

## Testing with coverage

- npm test

---

## 💡 Basic Usage

### Required Props

- **`searchProvider`** - Async function that fetches search results
- **`resultMapper`** - Function that transforms API results into dropdown format

### Features

- **Theming** - Built-in `light` and `dark` themes. Custom themes supported (see ocean theme example)
- **Filtering** - Apply filters before or during search.

```
 Raw data:

{
    customerId: "cust-101",
    name: "Ricardo Montero",
    email: "",
    memberSince: "2020-01-15",
  },
```

```
private resultMapper = (data: Customer): SearchResultItem => ({
    id: data.customerId,
    primaryText: data.name,
    original: data,
  });
```

### HTML

```html
<smart-search
  .searchProvider="${queryCustomers}"
  .resultMapper="${this.resultMapper}"
  id="my-search"
  theme="ocean"
  exclude="@#$%^&*()!"
></smart-search>
```

## TODO

- **Filter:** Date picker, reuse smart-dropdown, unit tests
- **Input:** Paste validation, default value
- **Dropdown:** Text highlighting, slot templates
