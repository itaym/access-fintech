
import './App.css';
import Menu from './components/Menu/Menu'
import MenuItem from './components/Menu/MenuItem'
import { useCallback, useState } from 'react'
function App() {

    const [clickedItem, setClickedItem] = useState()
    const [buttonClicked, setButtonClicked] = useState('')

    const onItemClick = useCallback((_, index) => {
            setClickedItem(index)
    }, [setClickedItem])

    const onButtonClick = useCallback(() => {
        setButtonClicked('Thanks for clicking on me')
        setTimeout(() => setButtonClicked(''), 5000)
    },[])

    const setBodyDir = useCallback((value) => {
        document.body.setAttribute('dir', value)
    },[])

    return (
        <div className="App">
            <div>
                <div>
                    <button onClick={setBodyDir.bind(null, 'ltr')}>Set left to right</button>
                    <button onClick={setBodyDir.bind(null, 'rtl')}>Set right to left</button>
                </div>
                <div>
                    Last Click On Item: {clickedItem}
                    <br />
                    {buttonClicked}
                </div>
            </div>
            <br />
            <Menu>
                <MenuItem onClick={onItemClick}>Option 0</MenuItem>
                <MenuItem onClick={onItemClick}>
                    <a target="_blank" href="http://youtube.com">Youtube</a>
                </MenuItem>
                <MenuItem onClick={onItemClick}>
                    <button onClick={onButtonClick}>Click me please</button>
                </MenuItem>
            </Menu>
            <br />
        </div>
    );
}

export default App;
