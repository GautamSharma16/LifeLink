import React from 'react'

const PageNotFound = () => {
  return (
          <Layout title="E-commerce Page not found">
        <div className="box">
          <div className="num">404</div>
          <div className="text">Oops,Page Not Found</div>
          <Link to="/">Go Back</Link>
        </div>
    </Layout>
    
  )
}

export default PageNotFound
