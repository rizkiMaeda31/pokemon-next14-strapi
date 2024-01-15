import { Button, ButtonGroup, Col, Container, Nav, Row } from "react-bootstrap"

export const BasicLayout=({children})=>{
    const LeftSide=<Col sm={2} style={{backgroundColor:"black"}}>
        <Nav className="flex-column">
            <Nav.Link disabled></Nav.Link>
            {/* <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/table1">CRUD</Nav.Link>
            <Nav.Link href="/table2">Export / Import Excel</Nav.Link>
            <Nav.Link href="/table3">Export / Import PDF</Nav.Link> */}
            <ButtonGroup vertical>
                <Button href="/dashboard" variant="primary">Dashboard</Button>
                <Button href="/t1" variant="light">CRUD</Button>
                <Button href="/t2" variant="light">Export / Import Excel</Button>
                <Button href="/t3" variant="light">Export / Import PDF</Button>
                <Button onClick={e=>alert(e.target.value)} variant="danger">Logout</Button>
            </ButtonGroup>
            
        </Nav>
    </Col>
    const RightSide=<Col sm={10} style={{backgroundColor:"aqua"}}>{children}</Col>
    return(
        <Container fluid>
            <Row>
                {LeftSide}
                {RightSide}
            </Row>
        </Container>
    )
}