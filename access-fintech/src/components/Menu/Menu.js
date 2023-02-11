import Conditional from '../Conditional'
import React from 'react'
import classNames from 'classnames'
import { useCallback, useState } from 'react'
import styles from './Menu.module.scss'
import { MoreIcon } from './MoreIcon'

const Menu = ({ children, className, tabIndex = 0, ...rest }) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState(0)
    const numOfItems = children.length

    const setMenuState = (isOpen) => {
        setIsMenuOpen(isOpen)
    }
    
    const onMenuClick = useCallback(() => {
        setMenuState(!isMenuOpen)
    }, [isMenuOpen])

    const onKeyDown = useCallback((keyEvent) => {
        if (keyEvent.key === 'Escape' || keyEvent.key === 'Esc') {
            setMenuState(false)
            return
        }
        setMenuState(!isMenuOpen)
    }, [isMenuOpen])

    const onMenuMouseOver = useCallback((index) => {
        if (currentItem === index) return
        setCurrentItem(index)
    }, [setCurrentItem, currentItem])

    const onMenuKeyDown = useCallback((keyEvent) => {
        let newIndex = currentItem

        switch (keyEvent.key) {
            case 'Right':
            case 'ArrowRight':
            case 'Down':
            case 'ArrowDown':
                newIndex = currentItem === numOfItems - 1 ? 0 : currentItem + 1
                break
            case 'Left':
            case 'ArrowLeft':
            case 'Up':
            case 'ArrowUp':
                newIndex = currentItem === 0 ? numOfItems - 1 : currentItem - 1
                break
            case 'Enter':
            case 'Esc':
            case 'Escape':
            case ' ':
                setIsMenuOpen(false)
                return
            default:
                return
        }
        setCurrentItem(newIndex)

    }, [currentItem, setCurrentItem, numOfItems])

    return (
        <div className={ classNames(styles.menu, className) } { ...rest }>
            <div
                tabIndex={tabIndex}
                onClick={onMenuClick}
                onKeyDown={onKeyDown}>
                <MoreIcon className={styles.more_icon} />
            </div>
            <Conditional condition={isMenuOpen}>
                <div
                    className={ styles.menu_layout}
                    onClick={onMenuClick}/>
                <div className={ styles.menu_holder }>
                {
                    React.Children.map(children, (child, index) => {
                        return React.cloneElement(child, {
                            index,
                            onMenuClick,
                            onMenuKeyDown,
                            onMenuMouseOver,
                            selected: currentItem === index,
                        });
                    })
                }
                </div>
            </Conditional>
        </div>
    )
}

export default Menu