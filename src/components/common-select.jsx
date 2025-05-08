import Select, { components } from "react-select";
import PropTypes from "prop-types";

// Custom Dropdown Indicator with SVG
const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 8L12 16L20 8H4Z" fill="#404040" />
      </svg>
    </components.DropdownIndicator>
  );
};

const CommonSelect = ({
  name,
  options,
  value,
  onChange,
  placeholder = "Select designation",
  isSearchable = false,
}) => {
  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "100%",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: "#E5E5E5",
      borderRadius: "8px",
      padding: "2px 4px",
      minHeight: "48px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#E5E5E5",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgb(240 245 242)"
        : state.isSelected
        ? "#e6f4ec"
        : "white",
      backgroundImage: state.isSelected
        ? "linear-gradient(3deg, #0B622F, #18934b)"
        : "none",
      color: state.isFocused ? "#121212" : state.isSelected ? "#fff" : "#121212",
      cursor: "pointer",
      padding: "10px 12px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="common-select-st mb-0">
      <Select
        name={name}
        value={options.find((opt) => opt.value === value)}
        onChange={(selected) =>
          onChange({ target: { name, value: selected?.value } })
        }
        options={options}
        styles={customStyles}
        isSearchable={isSearchable}
        placeholder={placeholder}
        components={{ DropdownIndicator }}
      />
    </div>
  );
};

CommonSelect.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isSearchable: PropTypes.bool,
};

export default CommonSelect;
