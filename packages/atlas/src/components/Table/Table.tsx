import { ReactElement, useEffect, useMemo, useRef } from 'react'
import { Column, useFlexLayout, usePagination, useTable } from 'react-table'
import useDraggableScroll from 'use-draggable-scroll'

import { TablePagination, TablePaginationProps } from '@/components/TablePagination'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  EmptyTableContainer,
  EmptyTableDescription,
  EmptyTableHeader,
  PageWrapper,
  TableBase,
  TableWrapper,
  Td,
  Th,
  Thead,
  Wrapper,
} from './Table.styles'

export type TableProps<T = object> = {
  columns: Column[]
  onRowClick?: (rowIdx: number) => void
  data: T[]
  title?: string
  pageSize?: number
  doubleColumn?: boolean
  emptyState?: {
    title: string
    description: string
    icon: ReactElement
  }
  className?: string
  pagination?: TablePaginationProps
  minWidth?: number
}

export const Table = <T extends object>({
  columns,
  data,
  title,
  pageSize = 10,
  emptyState,
  doubleColumn,
  onRowClick,
  className,
  pagination,
  minWidth = 300,
}: TableProps<T>) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { onMouseDown } = useDraggableScroll(scrollRef, { direction: 'horizontal' })
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page: rawPage,
    setPageSize,
    prepareRow,
  } = useTable({ columns, data, initialState: { pageSize } }, usePagination, useFlexLayout)

  useEffect(() => {
    setPageSize(pageSize)
  }, [pageSize, setPageSize])

  const page = useMemo(() => {
    if (doubleColumn) {
      const sliceIndex = Math.ceil(rawPage.length / 2)
      return [rawPage.slice(0, sliceIndex), rawPage.slice(sliceIndex)]
    }

    return [rawPage]
  }, [doubleColumn, rawPage])

  const mdMatch = useMediaMatch('md')
  return (
    <Wrapper className={className}>
      {title && (
        <Text
          as="h3"
          variant={mdMatch ? 'h500' : 'h400'}
          margin={{ top: mdMatch ? 6 : 4, bottom: 6, left: mdMatch ? 6 : 4 }}
        >
          {title}
        </Text>
      )}
      {data.length ? (
        <TableWrapper ref={scrollRef} onMouseDown={onMouseDown}>
          <PageWrapper minWidth={minWidth}>
            {page.map((subpage, idx) => (
              <TableBase className="table-base" {...getTableProps()} key={`table-slice-${idx}`}>
                <Thead className="table-header">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
                      {headerGroup.headers.map((column) => (
                        <Th
                          variant="h100"
                          as="th"
                          color="colorText"
                          {...column.getHeaderProps({ style: { width: column.width } })}
                          key={column.getHeaderProps().key}
                        >
                          {column.render('Header')}
                        </Th>
                      ))}
                    </tr>
                  ))}
                </Thead>
                <tbody {...getTableBodyProps()}>
                  {subpage.map((row, idx) => {
                    prepareRow(row)
                    return (
                      <tr
                        className="table-row"
                        {...row.getRowProps()}
                        onClick={() => onRowClick?.(idx)}
                        key={row.getRowProps().key}
                      >
                        {row.cells.map((cell) => (
                          <Td
                            variant="t100"
                            as="td"
                            {...cell.getCellProps()}
                            key={cell.getCellProps().key}
                            className="table-cell"
                          >
                            {cell.render('Cell')}
                          </Td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </TableBase>
            ))}
          </PageWrapper>
          {pagination && <TablePagination {...pagination} />}
        </TableWrapper>
      ) : emptyState ? (
        <EmptyTableContainer>
          {emptyState.icon}
          <EmptyTableHeader variant="h500" as="h5">
            {emptyState.title}
          </EmptyTableHeader>
          <EmptyTableDescription variant="t200" as="p" color="colorText">
            {emptyState.description}
          </EmptyTableDescription>
        </EmptyTableContainer>
      ) : null}
    </Wrapper>
  )
}
