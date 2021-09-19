import "@testing-library/react"
import { render, fireEvent } from "@testing-library/react"
import { Square } from "../Board/square"
import { Board } from "../board"
import { startBoard, BoardValues, createBoardPosition } from "../Board/utils"
import "@testing-library/jest-dom"
import { Colors } from "../Constants/colors"

test("select piece in A1", () => {
    const boardValues: BoardValues = {
        board: new Board(startBoard),
        selected: null,
        movements: [],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false,
    }
    const fn = jest.fn()
    const boardPosition: BoardPosition = createBoardPosition("A1")!
    const { container } = render(
        <Square
            position={boardPosition}
            piece={boardValues.board.getPieceFromPosition(boardPosition)}
            canMove={false}
            canKill={false}
            selected={false}
            inCheck={false}
            onSelected={fn}
        />,
    )
    fireEvent.click(container.children[0])
    expect(fn).toBeCalled()
})

test("color A1 selected", () => {
    const boardPosition: BoardPosition = createBoardPosition("A1")!
    const boardValues: BoardValues = {
        board: new Board(startBoard),
        selected: boardPosition,
        movements: [],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false,
    }
    const fn = jest.fn()
    render(
        <Square
            position={boardPosition}
            piece={boardValues.board.getPieceFromPosition(boardPosition)}
            canMove={false}
            canKill={false}
            selected={true}
            inCheck={false}
            onSelected={fn}
        />,
    )
    let contentDiv = document.getElementsByClassName("square")
    expect(contentDiv[0]).toHaveStyle({
        backgroundColor: Colors.selected_green,
    })
})

test("color A1 check", () => {
    const boardPosition: BoardPosition = createBoardPosition("A1")!
    const boardValues: BoardValues = {
        board: new Board(startBoard),
        selected: null,
        movements: [],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false,
    }
    const fn = jest.fn()
    render(
        <Square
            position={boardPosition}
            piece={boardValues.board.getPieceFromPosition(boardPosition)}
            canMove={false}
            canKill={false}
            selected={false}
            inCheck={true}
            onSelected={fn}
        />,
    )
    let contentDiv = document.getElementsByClassName("square")
    expect(contentDiv[0]).toHaveStyle({ backgroundColor: Colors.red })
})

test("color A1 move", () => {
    const boardPosition: BoardPosition = createBoardPosition("A1")!
    const boardValues: BoardValues = {
        board: new Board(startBoard),
        selected: null,
        movements: [],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false,
    }
    const fn = jest.fn()
    render(
        <Square
            position={boardPosition}
            piece={boardValues.board.getPieceFromPosition(boardPosition)}
            canMove={true}
            canKill={false}
            selected={false}
            inCheck={false}
            onSelected={fn}
        />,
    )

    let contentDiv = document.getElementsByClassName("square")
    expect(contentDiv[0]).toHaveStyle({ backgroundColor: Colors.move_blue })
})

test("A1 case color", () => {
    const boardPosition: BoardPosition = createBoardPosition("A1")!
    const boardValues: BoardValues = {
        board: new Board(startBoard),
        selected: null,
        movements: [],
        killMovements: [],
        isBlackTurn: false,
        check: null,
        cemetery: [],
        endGame: false,
    }
    const fn = jest.fn()
    render(
        <Square
            position={boardPosition}
            piece={boardValues.board.getPieceFromPosition(boardPosition)}
            canMove={false}
            canKill={false}
            selected={false}
            inCheck={false}
            onSelected={fn}
        />,
    )

    let contentDiv = document.getElementsByClassName("square")
    expect(contentDiv[0]).toHaveStyle({ backgroundColor: Colors.brown })
})
