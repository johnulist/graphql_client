import React, {Component} from 'react';
import axios from 'axios';

import './App.css';

const TITLE = 'React GraphQL GitHub client';

const axiosGitHubGraphQL = axios.create({
    baseURL: 'https://api.github.com/graphql',
    headers: {
        Authorization: `bearer ${
            process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
            }`,
    }
});

const GET_ORGANIZATION = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
        }
    }
`;

const GET_ISSUES_OF_REPOSITORY = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
            repository(name: "the-road-to-learn-react") {
                name
                url
                issues(last: 5) {
                edges {
                        node {
                            id
                            title
                            url
                        }
                    }
                }
            }
        }
    }
`;

const GET_REPOSITORY_OF_ORGANIZATION = `
    {
        organization(login: "the-road-to-learn-react") {
            name
            url
            repository(name: "the-road-to-learn-react") {
                name
                url
            }
        }
    }
`;

const Organization = ({organization, errors}) => {
    if (errors) {
        return (
            <p>
                <strong>Something went wrong :</strong>
                {errors.map(error => error.message).join(' ')}
            </p>
        );
    }

    return (
        <div>
            <p>
                <strong>Issues from Organization: </strong>
                <a href={organization.url}>{organization.name}</a>
            </p>
            <Repository repository={organization.repository}/>
        </div>
    );
};

const Repository = ({repository}) => (
    <div>
        <p>
            <strong>In Repository: </strong>
            <a href={repository.url}>{repository.name}</a>
        </p>
    </div>
);

export default class App extends Component {

    state = {
        path: 'the-road-to-learn-react/the-road-to-learn-react',
        organization: null,
        errors: null,
    };

    componentDidMount() {
        this.onFetchFromGitHub();
    }

    onChange = event => {
        this.setState({path: event.target.value})
    };

    onSubmit = event => {
        event.preventDefault();
    };

    onFetchFromGitHub() {
        axiosGitHubGraphQL
            .post('', {query: GET_ISSUES_OF_REPOSITORY})
            .then(result => {
                console.log(result);
                this.setState(() => ({
                    organization: result.data.data.organization,
                    errors: result.data.errors
                }))}
            )
            .catch(err => console.log('Erreur Axios : ', err)
            );
    };


    render() {
        const {path, organization, errors} = this.state;

        return (
            <div>
                <h1>{TITLE}</h1>


                <form onSubmit={this.onSubmit}>
                    <label htmlFor="url">
                        Show open isues for https://github.com
                    </label>
                    <input type="text"
                           id="url"
                           value={path}
                           onChange={this.onChange}
                           style={{width: '300px'}}
                    />
                    <button type="submit">Search</button>
                </form>
                <hr/>
                {organization ? (
                    <Organization organization={organization} errors={errors}/>
                ) : (
                    <p>No information yet ...</p>
                )}
            </div>
        );
    }
}


