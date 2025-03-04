import React from 'react'

function Pagination() {


    return (
    <>
        <div class="pagination">
            <div class="paginationLeft">
                <span>Page</span>
                <a href="#" class="prev">&lt;</a>
                <a href="#" class="active">1</a>
                <a href="#">2</a>
                <a href="#">3</a>
                <a href="#">4</a>
                <a href="#" class="next">&gt;</a>
            </div>
            <div  class="paginationRight">
                <span>Showing 10 of 50</span>
            </div>
            </div>
       
    </>
  )
}

export default Pagination