// FormField.js
import React from 'react';

function FormField({ label, id, name, type = "text", value, onChange, placeholder, required = false, options, readOnly }) {
    return (
        <div className="w-full md:w-1/2 px-2 mb-4">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            {type === "select" ? (
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border rounded-lg"
                    required={required}
                    disabled={readOnly}
                >
                    <option value="">Select {label}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
}

export default FormField;
