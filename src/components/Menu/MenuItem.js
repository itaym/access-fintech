import classNames from 'classnames'
import styles from './Menu.module.scss'
import { useCallback, useEffect, useRef } from 'react'

const MenuItem = (
    {
        children,
        className,
        index,
        onClick = () => {},
        onMenuClick,
        onMenuKeyDown,
        onMenuMouseOver,
        selected,
        tabIndex = 0,
        ...rest }) => {

    const liRef = useRef()

    const onMenuItemClick = useCallback((mouseEvent) => {
        onMenuClick()
        onClick(mouseEvent, index)
    }, [onMenuClick, onClick, index])

    const onMenuItemMouseOver = useCallback(() => {
        if (selected) return
        onMenuMouseOver(index)
    }, [index, selected, onMenuMouseOver])

    const onMenuItemKeyDown = useCallback((keyEvent) => {

        onMenuKeyDown(keyEvent)

        switch (keyEvent.key) {
            case "Enter":
            case " ":
                onMenuItemClick(keyEvent)
                break
            default:
                return
        }
    }, [onMenuItemClick, onMenuKeyDown])

    useEffect(() => {
        if (selected) {
            liRef.current.focus()
        }
    })
    return (
        <div tabIndex={tabIndex} style={{display:'block'}}
             {...rest}
            className={ classNames(className, styles.menu_item, { [styles.is_selected]: selected }) }
            onClick={onMenuItemClick}
            onKeyDown={onMenuItemKeyDown}
            onMouseOver={onMenuItemMouseOver}
            ref={liRef}>
            {children}
        </div>
    )
}

export default MenuItem