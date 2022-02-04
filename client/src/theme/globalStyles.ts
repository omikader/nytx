import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .responsiveTable {
    width: 100%;
  }
  
  .responsiveTable td .tdBefore {
    display: none;
  }
  
  @media screen and (max-width: 40em) {
    /*
      Force table elements to not behave like tables anymore
      Hide table headers (but not display: none;, for accessibility)
    */
  
    .responsiveTable table,
    .responsiveTable thead,
    .responsiveTable tbody,
    .responsiveTable th,
    .responsiveTable td,
    .responsiveTable tr {
      display: block;
    }
  
    .responsiveTable thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
      border-bottom: 2px solid #333;
    }
  
    .responsiveTable tbody tr {
      border: 1px solid #000;
      padding: .25em;
    }
  
    .responsiveTable td.pivoted {
      /* Behave like a "row" */
      border: none !important;
      position: relative;
      padding-left: calc(50% + 10px) !important;
      text-align: left !important;
      white-space: pre-wrap;
      overflow-wrap: break-word;
    }
  
    .responsiveTable td .tdBefore {
      /* Now like a table header */
      position: absolute;
      display: block;
  
      /* Top/left values mimic padding */
      left: 1rem;
      width: calc(50% - 20px);
      white-space: pre-wrap;
      overflow-wrap: break-word;
      text-align: left !important;
      font-weight: 600;
    }
  }
`;

export default GlobalStyle;
