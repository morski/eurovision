import { FunctionComponent, useEffect, useState } from "react";
import Select from 'react-select';
import "./filters.css";

/* type Props = {
    filters: IFilters,
    eventYear: number
}; */

const Filters: FunctionComponent = () => {

  /* const sort1 = () => {
    console.log('idk');
  } */
  const optionsDir = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

   const options = [
    { value: 'countries', label: 'Countries' },
    { value: 'songName', label: 'Song name' },
    { value: 'points', label: 'Point total' },
    { value: 'performanceNr', label: 'Performance number' },
  ];

  // states
  const [selectedDir, setSelectedDir] = useState(optionsDir[0]); // Declare a state variable...
  const [selectedOpt, setSelectedOpt] = useState(options[0]);
  const [isClearable, setIsClearable] = useState(true);

 
  // const selectElement = document.getElementById('sort-by-date') as HTMLSelectElement;

/*   options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.label;
    selectElement.add(optionElement);
  }); */

  const SortDir = () => (
    <Select 
    options={optionsDir} 
    className="select"
    defaultValue={selectedDir}
    isClearable={isClearable}
     />
  )

   const Sort = () => (function(){}
    // TODO: do sorting here
  ) 
  
  const SortOptions = () => (
    <Select 
    options={options} 
    className="select"
    defaultValue={selectedOpt}
    isClearable={isClearable}
    onChange={Sort}
    />
  )

  return (
    <div className="select-container" >
        <SortDir />
        <SortOptions />
    </div>
  );
}

export default Filters;