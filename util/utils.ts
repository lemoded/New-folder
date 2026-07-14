import * as XLSX from 'xlsx';

export interface GetMapOfMultiRowTableOptions {
  filePath: string;
  sheetName: string;
  uniqueData: string;
  uniqueDataIndex: number;
  isTableVertical: boolean;
}

export type StringMap = Record<string, string>;

export function getMapOfMultiRowTable(options: GetMapOfMultiRowTableOptions): StringMap {
  const { filePath, sheetName, uniqueData, uniqueDataIndex, isTableVertical } = options;

  if (!filePath || !sheetName) {
    throw new Error('filePath and sheetName are required.');
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet '${sheetName}' not found in workbook '${filePath}'.`);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const tableMap: StringMap = {};
  const normalizedUniqueData = uniqueData?.trim().toLowerCase();
  const hasUniqueData = Boolean(normalizedUniqueData) && Number.isInteger(uniqueDataIndex) && uniqueDataIndex >= 0;

  if (!hasUniqueData) {
    return tableMap;
  }

  if (isTableVertical) {
    const uniqueDataRow = rows[uniqueDataIndex];
    if (!Array.isArray(uniqueDataRow)) {
      return tableMap;
    }

    const uniqueDataColumnIndex = uniqueDataRow.findIndex(
      (cell, idx) => idx > 0 && String(cell).trim().toLowerCase() === normalizedUniqueData,
    );

    if (uniqueDataColumnIndex < 0) {
      return tableMap;
    }

    for (const row of rows) {
      const keyCell = row[0];
      if (keyCell == null || String(keyCell).trim() === '') {
        continue;
      }
      const valueCell = row[uniqueDataColumnIndex];
      tableMap[String(keyCell).trim()] = String(valueCell ?? '').trim();
    }
  } else {
    // For non-vertical tables, use the row above the matched unique-data row as headers
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      if (!Array.isArray(row)) {
        continue;
      }

      const rowUniqueCell = row[uniqueDataIndex];
      if (String(rowUniqueCell).trim().toLowerCase() !== normalizedUniqueData) {
        continue;
      }

      const keyRow = rows[rowIndex - 1];
      if (!Array.isArray(keyRow)) {
        break;
      }

      for (let cellIndex = 0; cellIndex < keyRow.length; cellIndex += 1) {
        const headerCell = keyRow[cellIndex];
        if (headerCell == null || String(headerCell).trim() === '') {
          continue;
        }
        const valueCell = row[cellIndex];
        tableMap[String(headerCell).trim()] = String(valueCell ?? '').trim();
      }
      break;
    }
  }

  return tableMap;
}

export interface WriteDataToCellForSingleRowTableOptions {
  filePath: string;
  sheetName: string;
  uniqueData: string;
  uniqueDataIndex: number;
  header: string;
  data: string;
  isTableVertical: boolean;
}

export function writeDataToCellForSingleRowTable(options: WriteDataToCellForSingleRowTableOptions): boolean {
  const { filePath, sheetName, uniqueData, uniqueDataIndex, header, data, isTableVertical } = options;

  if (!filePath || !sheetName) {
    throw new Error('filePath and sheetName are required.');
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet '${sheetName}' not found in workbook '${filePath}'.`);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const normalizedUniqueData = uniqueData?.trim().toLowerCase();
  const normalizedHeader = header?.trim().toLowerCase();

  if (isTableVertical) {
    const uniqueDataRow = rows[uniqueDataIndex];
    if (!Array.isArray(uniqueDataRow)) {
      return false;
    }

    const uniqueDataColumnIndex = uniqueDataRow.findIndex(
      (cell, idx) => idx > 0 && String(cell).trim().toLowerCase() === normalizedUniqueData,
    );

    if (uniqueDataColumnIndex < 0) {
      return false;
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      if (rowIndex === uniqueDataIndex) {
        continue;
      }

      const row = rows[rowIndex];
      if (!Array.isArray(row)) {
        continue;
      }

      const keyCell = row[uniqueDataColumnIndex - 1];
      if (String(keyCell ?? '').trim().toLowerCase() === normalizedHeader) {
        const cellRef = XLSX.utils.encode_cell({ c: uniqueDataColumnIndex, r: rowIndex });
        worksheet[cellRef] = { t: 's', v: String(data) };
        XLSX.writeFile(workbook, filePath);
        return true;
      }
    }

    return false;
  }

  const headerRow = rows[0];
  if (!Array.isArray(headerRow)) {
    return false;
  }

  const headerColumnIndex = headerRow.findIndex(
    (cell) => String(cell).trim().toLowerCase() === normalizedHeader,
  );

  if (headerColumnIndex < 0) {
    return false;
  }

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!Array.isArray(row)) {
      continue;
    }

    if (String(row[uniqueDataIndex] ?? '').trim().toLowerCase() !== normalizedUniqueData) {
      continue;
    }

    const cellRef = XLSX.utils.encode_cell({ c: headerColumnIndex, r: rowIndex });
    worksheet[cellRef] = { t: 's', v: String(data) };
    XLSX.writeFile(workbook, filePath);
    return true;
  }

  return false;
}

export interface GetStringCellDataFromSingleRowTableOptions {
  filePath: string;
  sheetName: string;
  header: string;
  uniqueData: string;
  uniqueDataIndex: number;
  isTableVertical: boolean;
}

export function getStringCellDataFromSingleRowTable(options: GetStringCellDataFromSingleRowTableOptions): string {
  const { filePath, sheetName, header, uniqueData, uniqueDataIndex, isTableVertical } = options;

  if (!filePath || !sheetName) {
    throw new Error('filePath and sheetName are required.');
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet '${sheetName}' not found in workbook '${filePath}'.`);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const normalizedUniqueData = uniqueData?.trim().toLowerCase();
  const normalizedHeader = header?.trim().toLowerCase();

  if (isTableVertical) {
    const uniqueDataRow = rows[uniqueDataIndex];
    if (!Array.isArray(uniqueDataRow)) {
      return '';
    }

    const uniqueDataColumnIndex = uniqueDataRow.findIndex(
      (cell, idx) => idx > 0 && String(cell).trim().toLowerCase() === normalizedUniqueData,
    );

    if (uniqueDataColumnIndex < 0) {
      return '';
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      if (!Array.isArray(row)) {
        continue;
      }
      const keyCell = row[uniqueDataColumnIndex - 1];
      if (String(keyCell ?? '').trim().toLowerCase() === normalizedHeader) {
        return String(row[uniqueDataColumnIndex] ?? '').trim();
      }
    }

    return '';
  }

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!Array.isArray(row)) {
      continue;
    }

    if (String(row[uniqueDataIndex] ?? '').trim().toLowerCase() !== normalizedUniqueData) {
      continue;
    }

    const headerRow = rows[0];
    if (!Array.isArray(headerRow)) {
      return '';
    }

    const headerColumnIndex = headerRow.findIndex(
      (cell) => String(cell).trim().toLowerCase() === normalizedHeader,
    );

    if (headerColumnIndex < 0) {
      return '';
    }

    return String(row[headerColumnIndex] ?? '').trim();
  }

  return '';
}

export interface GetStringCellDataFromMultiRowTableOptions {
  filePath: string;
  sheetName: string;
  header: string;
  uniqueData: string;
  uniqueDataIndex: number;
  isTableVertical: boolean;
}

export function getStringCellDataFromMultiRowTable(options: GetStringCellDataFromMultiRowTableOptions): string {
  const { filePath, sheetName, header, uniqueData, uniqueDataIndex, isTableVertical } = options;

  if (!filePath || !sheetName) {
    throw new Error('filePath and sheetName are required.');
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet '${sheetName}' not found in workbook '${filePath}'.`);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const normalizedUniqueData = uniqueData?.trim().toLowerCase();
  const normalizedHeader = header?.trim().toLowerCase();

  if (isTableVertical) {
    const uniqueDataRow = rows[uniqueDataIndex];
    if (!Array.isArray(uniqueDataRow)) {
      return '';
    }

    const uniqueDataColumnIndex = uniqueDataRow.findIndex(
      (cell, idx) => idx > 0 && String(cell).trim().toLowerCase() === normalizedUniqueData,
    );

    if (uniqueDataColumnIndex < 0) {
      return '';
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      if (!Array.isArray(row)) {
        continue;
      }
      const keyCell = row[0];
      if (String(keyCell ?? '').trim().toLowerCase() === normalizedHeader) {
        return String(row[uniqueDataColumnIndex] ?? '').trim();
      }
    }

    return '';
  }

  const headerRow = rows[0];
  if (!Array.isArray(headerRow)) {
    return '';
  }

  const headerColumnIndex = headerRow.findIndex(
    (cell) => String(cell).trim().toLowerCase() === normalizedHeader,
  );

  if (headerColumnIndex < 0) {
    return '';
  }

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!Array.isArray(row)) {
      continue;
    }

    if (String(row[uniqueDataIndex] ?? '').trim().toLowerCase() !== normalizedUniqueData) {
      continue;
    }

    return String(row[headerColumnIndex] ?? '').trim();
  }

  return '';
}

export interface WriteDataToCellForMultiRowTableOptions {
  filePath: string;
  sheetName: string;
  header: string;
  uniqueData: string;
  uniqueDataIndex: number;
  data: string;
  isTableVertical: boolean;
}

export function writeDataToCellForMultiRowTable(options: WriteDataToCellForMultiRowTableOptions): boolean {
  const { filePath, sheetName, header, uniqueData, uniqueDataIndex, data, isTableVertical } = options;

  if (!filePath || !sheetName) {
    throw new Error('filePath and sheetName are required.');
  }

  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet '${sheetName}' not found in workbook '${filePath}'.`);
  }

  const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    raw: false,
    defval: '',
  });

  const normalizedUniqueData = uniqueData?.trim().toLowerCase();
  const normalizedHeader = header?.trim().toLowerCase();

  if (isTableVertical) {
    const uniqueDataRow = rows[uniqueDataIndex];
    if (!Array.isArray(uniqueDataRow)) {
      return false;
    }

    const uniqueDataColumnIndex = uniqueDataRow.findIndex(
      (cell, idx) => idx > 0 && String(cell).trim().toLowerCase() === normalizedUniqueData,
    );

    if (uniqueDataColumnIndex < 0) {
      return false;
    }

    const keyColumnIndex = 0;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      if (!Array.isArray(row)) {
        continue;
      }
      const keyCell = row[keyColumnIndex];
      if (String(keyCell ?? '').trim().toLowerCase() === normalizedHeader) {
        const cellRef = XLSX.utils.encode_cell({ c: uniqueDataColumnIndex, r: rowIndex });
        worksheet[cellRef] = { t: 's', v: String(data) };
        XLSX.writeFile(workbook, filePath);
        return true;
      }
    }

    return false;
  }

  const headerRow = rows[0];
  if (!Array.isArray(headerRow)) {
    return false;
  }

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!Array.isArray(row)) {
      continue;
    }

    if (String(row[uniqueDataIndex] ?? '').trim().toLowerCase() !== normalizedUniqueData) {
      continue;
    }

    const headerColumnIndex = headerRow.findIndex(
      (cell) => String(cell).trim().toLowerCase() === normalizedHeader,
    );

    if (headerColumnIndex < 0) {
      return false;
    }

    const cellRef = XLSX.utils.encode_cell({ c: headerColumnIndex, r: rowIndex });
    worksheet[cellRef] = { t: 's', v: String(data) };
    XLSX.writeFile(workbook, filePath);
    return true;
  }

  return false;
}

// Example usage:
// const result = getMapOfMultiRowTable({
//   filePath: './data/sample.xlsx',
//   sheetName: 'Sheet1',
//   uniqueData: 'randomData',
//   uniqueDataIndex: 3,
//   isTableVertical: false,
// });
// console.log(result);
//
// const wrote = writeDataToCellForSingleRowTable({
//   filePath: './data/sample.xlsx',
//   sheetName: 'Sheet1',
//   uniqueData: 'randomData',
//   uniqueDataIndex: 3,
//   header: 'randomHeader',
//   data: 'updated value',
//   isTableVertical: false,
// });
// console.log(wrote);
