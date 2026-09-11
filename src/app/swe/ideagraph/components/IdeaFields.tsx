type IdeaFieldName = "name" | "description" | "originDate";

type IdeaFieldsProps = {
  values?: Partial<Record<IdeaFieldName, string | number>>;
};

const fields: {
  name: IdeaFieldName;
  label: string;
  placeholder?: string;
  required?: boolean;
}[] = [
  {
    name: "name",
    label: "Name",
    placeholder: "Example: Methodism",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Short description...",
  },
  {
    name: "originDate",
    label: "Origin Year",
    placeholder: "Example: 1784",
    required: true,
  },
];

export default function IdeaFields({ values = {} }: IdeaFieldsProps) {
  return fields.map(({ name, label, placeholder, required }) => (
    <label key={name} className="input w-full">
      <span className="label w-30">{label}</span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={values[name] ?? ""}
        required={required}
      />
    </label>
  ));
}
