import React, { useState } from 'react';

const SearchBar = () => {
  const [value, setValue] = useState('');

  return (
    <div style={{ margin: 20 }}>
      <input
        type="text"
        placeholder="Search for a Building"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;