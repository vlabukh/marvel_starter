import { Link } from 'react-router-dom'
import { Helmet, HelmetProvider} from 'react-helmet-async'

import ErrorMessage from '../errorMessage/ErrorMessage'

const Page404 = () => {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <meta
            name='description'
            content='404 page'
          />
          <title>Page doesn't exist</title>
        </Helmet>
        <ErrorMessage/>
        <p
          style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}}>
            Page doesn't exist</p>
        <Link
          style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}}
          to='/'>
            Back to main page</Link>
      </div>
    </HelmetProvider>
  )
}

export default Page404