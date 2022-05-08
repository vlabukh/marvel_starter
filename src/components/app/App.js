import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TestComponent from './testComponent/TestComponent'
import AppHeader from '../appHeader/AppHeader'
import Spinner from '../spinner/Spinner'

const Page404 = lazy(() => import('../pages/404'))
const MainPage = lazy(() => import('../pages/MainPage'))
const ComicsPage = lazy(() => import('../pages/ComicsPage'))
const SinglePage = lazy(() => import('../singlePage/SinglePage'))
const SingleComicLayout = lazy(() => import('../singlePage/singleComicLayout/SingleComicLayout'))
const SingleCharacterLayout = lazy(() => import('../singlePage/singleCharacterLayout/SingleCharacterLayout'))

//659 kb
const App = () => {
  return (
    <Router>
      <div className='app'>
      {/* <TestComponent/> */}
        <AppHeader/>
        <main>
          <Suspense fallback={<Spinner/>}>
            <Routes>
              <Route path='/' element={<MainPage/>}/>
              <Route path='/comics' element={<ComicsPage/>}/>
              <Route
                path='/comics/:id' 
                element={<SinglePage
                  Component={SingleComicLayout}
                  dataType='comic'/>}/>
              <Route
                path='/characters/:id' 
                element={<SinglePage
                  Component={SingleCharacterLayout}
                  dataType='character'/>}/>
              <Route path='*' element={<Page404/>}/>
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  )
}

export default App