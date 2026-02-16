import React, { useEffect, useState } from 'react'
import DefaultLayout from '@/layout/DefaultLayout'
import BreadCrumb from '@/components/common/ui/BreadCrumb'
import { AgGridReact } from 'ag-grid-react'
import Pagination from '@/components/common/ui/PaginationFooter'
import { BlockAPI, BlockResponse } from '@/utils/api/block.api'


const BlockList = () => {
  const [block, setBlock] = useState<BlockResponse>({
    count: 0,
    data: []
  })


  const fetchBlocks = async () => {
    try {
      const res = await BlockAPI.getAll()
      if (res.status) {
        setBlock(res.result)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchBlocks()
  }, []);

  const colDefs: any = [
    { field: 'blockedUser', headerName: 'Blocked User', flex: 1, sortable: true },
    { field: 'blockerUser', headerName: 'Blocker', flex: 1, sortable: true },
    {
      field: 'createdAt', headerName: 'Blocked Date', flex: 1, sortable: true, valueFormatter: (params: any) => {
        if (!params.value) return 'N/A';
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(params.value));
      },
    },
  ];

  return (
    <DefaultLayout>
      <div>
        <BreadCrumb pageName='Blocked Users' />
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">

            <AgGridReact className="w-full" rowData={block.data} columnDefs={colDefs} />

          </div>
          <div className='relative z-1 -mt-4'>
            {block?.count > 0 &&
              <Pagination getRequestData={fetchBlocks} total={block.count} />
            }
          </div>
        </div>

      </div>
    </DefaultLayout>
  )
}

export default BlockList