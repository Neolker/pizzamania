import {useContext, useEffect, useState} from "react";
import UserContext from "../UserProvider";
import {useNavigate} from "react-router-dom";
import Icon from "@mdi/react";
import {mdiAlertOctagonOutline} from "@mdi/js";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RecipeDelete from "../bricks/RecipeDelete";
import RecipeForm from "../bricks/RecipeForm";
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function Home() {

    const [listRecipeCall, setListRecipeCall] = useState({
        state: "pending",
    });
    const [addRecipeShow, setAddRecipeShow] = useState({
        state: false
    });

    const {isEditor, isAdmin} = useContext(UserContext);

    let navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/recipe/list`, {
            method: "GET",
        }).then(async (response) => {
            const responseJson = await response.json();
            if (response.status >= 400) {
                setListRecipeCall({state: "error", error: responseJson});
            } else {
                setListRecipeCall({state: "success", data: responseJson});
            }
        });
    }, []);

    const handleRecipeDelete = (recipeId) => {
        if (listRecipeCall.state === "success") {
            fetch(`http://localhost:3000/recipe/list`, {
                method: "GET",
            }).then(async (response) => {
                const responseJson = await response.json();
                if (response.status >= 400) {
                    setListRecipeCall({state: "error", error: responseJson});
                } else {
                    setListRecipeCall({state: "success", data: responseJson});
                }
            });
        }
    }


    const handleAddRecipeShow = (data) => setAddRecipeShow({state: true, data});

    const handleRecipeAdded = (recipe) => {
        if (listRecipeCall.state === "success") {
            fetch(`http://localhost:3000/recipe/list`, {
                method: "GET",
            }).then(async (response) => {
                const responseJson = await response.json();
                if (response.status >= 400) {
                    setListRecipeCall({state: "error", error: responseJson});
                } else {
                    setListRecipeCall({state: "success", data: responseJson});
                }
            });
        }
    }

    function chunkArray(arr, size) {
        let groupedArray = [];
        for(let i = 0; i < arr.length; i += size) {
            groupedArray.push(arr.slice(i, i+size));
        }
        return groupedArray ;
    }


    function getRecipeList() {
        switch (listRecipeCall.state) {
            case "pending":
                return (<Stack direction="horizontal" gap={3}>
                    <Card style={{width: '18rem'}}>
                        <Placeholder as={Card.Image} animation="glow">
                            <Placeholder className="w-100" style={{height: '135px'}}/>
                        </Placeholder> <Card.Body>
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6}/>
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                            <Placeholder xs={6}/> <Placeholder xs={8}/>
                        </Placeholder>
                        <Placeholder.Button variant="primary" xs={6}/>
                    </Card.Body>
                    </Card>
                    <Card style={{width: '18rem'}}>
                        <Placeholder as={Card.Image} animation="glow">
                            <Placeholder className="w-100" style={{height: '135px'}}/>
                        </Placeholder>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6}/>
                        </Card.Body>
                    </Card>
                    <Card style={{width: '18rem'}}>
                        <Placeholder as={Card.Image} animation="glow">
                            <Placeholder className="w-100" style={{height: '135px'}}/>
                        </Placeholder>
                        <Card.Body>
                            <Placeholder as={Card.Title} animation="glow">
                                <Placeholder xs={6}/>
                            </Placeholder>
                            <Placeholder as={Card.Text} animation="glow">
                                <Placeholder xs={7}/> <Placeholder xs={4}/> <Placeholder xs={4}/>{' '}
                                <Placeholder xs={6}/> <Placeholder xs={8}/>
                            </Placeholder>
                            <Placeholder.Button variant="primary" xs={6}/>
                        </Card.Body>
                    </Card>
                </Stack>);
            case "success":
                return (
                    chunkArray(listRecipeCall.data, 4).map( card =>
                        <Row className='justify-content-md-center'>
                            {card.map((recipe) =>
                                <Col className='text-center mt-5'>
                                    <Card style={{width: '18rem', margin: 'auto'}}>
                                        <Placeholder className="rounded-top" as={Card.Image}>
                                            <Placeholder className="w-100 rounded-top" style={{height: '135px'}}/>
                                        </Placeholder>
                                        <Card.Body>
                                            <Card.Title>
                                                {recipe.name}
                                            </Card.Title>
                                            <Card.Text>
                                                {recipe.description}
                                            </Card.Text>

                                            <Button variant="primary"
                                                    onClick={() => navigate("/recipeDetail?id=" + recipe.id)}
                                            >Otevřít</Button>
                                            <ButtonGroup className='ms-2'>

                                                {(isEditor() || isAdmin()) && <Button variant="secondary"
                                                                                      onClick={() => handleAddRecipeShow(recipe)}>Upravit</Button>}
                                                {(isAdmin()) && <RecipeDelete recipe={recipe}
                                                                              onDelete={handleRecipeDelete}></RecipeDelete>}
                                            </ButtonGroup>

                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )
                )
            case "error":
                return (<div>
                    <Icon size={1} path={mdiAlertOctagonOutline}/> Error
                </div>);
            default:
                return null;
        }
    }

    return (
        <Container>
            {getRecipeList()}

            {(isEditor() || isAdmin()) &&
                <ButtonGroup vertical className='position-fixed bottom-0 end-0 mb-5 me-4'>
                    <Button variant="success" onClick={() => handleAddRecipeShow()}>Přidat recept</Button>
                    <Button variant="danger">Přidat ingredienci</Button>
                </ButtonGroup>}


            <RecipeForm
                show={addRecipeShow.state}
                recipe={addRecipeShow.data}
                setAddGradeShow={setAddRecipeShow}
                onComplete={(recipe) => handleRecipeAdded(recipe)}
            />
        </Container>);
}

export default Home;
