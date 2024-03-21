import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'


const PETS_FIELDS = gql`
    fragment PetsFields on Pet {
      id
        name
        type
        img
        owner {
            id
            age @client
        }
    }
`


const ALL_PETS_QUERY = gql`
query AllPets {
  pets {
    ...PetsFields
  }
}
${PETS_FIELDS}
`

const NEW_PET = gql`
    mutation CreateAPet($newPet: NewPetInput!) {
      addPet(input: $newPet) {
        ...PetsFields
      }
    }
    ${PETS_FIELDS}
`

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(ALL_PETS_QUERY);
  const [createPet, newPet] = useMutation({ ...NEW_PET }, {
    update(cache, { data: { addPet } }) {
      const data = cache.readQuery({ query: ALL_PETS_QUERY });
      data.pets.push(addPet);
      cache.writeQuery({ query: ALL_PETS_QUERY, data });
    }
  });

  const onSubmit = (input) => {
    setModal(false);
    createPet(
      {
        variables: {
          newPet: input,
        },

        optimisticResponse: {
          __typename: "Mutation",
          addPet: {
            ...input,
            id: 123,
            img: "https://via.placeholder.com/300",
            __typename: "Pet",
          },
        },
      }
    );
  };

  if (!data) {
    return (
      <div>
        <h1>Pets</h1>
        <p>Loading</p>
      </div>
    );
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  if (loading /* || newPet.loading */) {
    return <Loader />;
  }

  if (error || newPet.error) {
    return <div>Error</div>;
  }
  console.log(data.pets[0])
  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}

