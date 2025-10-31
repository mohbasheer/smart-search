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

The `smart-search` component requires a `searchProvider` (an asynchronous function to fetch results) and a `resultMapper` (a function to transform raw results into a format the dropdown understands). dark and light theme are available. user can add their own theme as well. provided example has ocean theme.

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

### TODO

- smart-filter. add date component, re-use smart-dropdown in filter and add unit testing
- exclude logic for copy and paste as well and default value
- highlight text in li when match found - date picker component as a Filter option
- dynamic drop down template via Slot
