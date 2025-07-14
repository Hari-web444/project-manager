import Select, { components } from "react-select";
import PropTypes from "prop-types";
import { matchSorter } from "match-sorter"; 

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
    option: (provided, state) => {
      let backgroundColor;
      if (state.isFocused) {
        backgroundColor = "rgb(240 245 242)";
      } else if (state.isSelected) {
        backgroundColor = "#e6f4ec";
      } else {
        backgroundColor = "white";
      }
  
      const backgroundImage = state.isSelected
        ? "linear-gradient(3deg, #0B622F, #18934b)"
        : "none";
  
      let color;
      if (state.isFocused) {
        color = "#121212";
      } else if (state.isSelected) {
        color = "#fff";
      } else {
        color = "#121212";
      }
  
      return {
        ...provided,
        backgroundColor,
        backgroundImage,
        color,
        cursor: "pointer",
        padding: "10px 12px",
      };
    },
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
  const selectedOption = value
    ? options.find((opt) => opt.value === value)
    : null;

    const filterOption = (option, rawInput) => {
      const filtered = matchSorter(options, rawInput, {
        keys: ["label"],
      });
      return filtered.some((f) => f.value === option.value);
    };
    

  return (
    <div className="common-select-st mb-0">
      <Select
        name={name}
        value={selectedOption}
        onChange={(selected) =>
          onChange({ target: { name: selected?.label, value: selected?.value , code: selected?.code, id: selected?.id } })
        }
        options={options}
        styles={customStyles}
        isSearchable={isSearchable}
        placeholder={placeholder}
        filterOption={filterOption} 
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
      type_name: PropTypes.any,
    })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  isSearchable: PropTypes.bool,
};

export default CommonSelect;
