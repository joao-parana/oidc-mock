import { Provider } from 'oidc-provider';

const configuration = {
  // Aqui, o TypeScript já sabe quais propriedades são válidas dentro de 'configuration'
  // e quais são os tipos esperados para cada uma.
  clients: [
    {
      client_id: 'procapex_client',
      client_secret: 'E9m6h975i+.',
      redirect_uris: [
        'http://localhost:5173/api/authorize/',
        'http://procapex.cepel.br:5173/api/authorize/'
    ],
    },
  ],
};

const provider = new Provider('http://localhost:3456', configuration);
const server = provider.listen(3456, () => {
  console.log(
    "oidc-provider listening on port 3456, check http://localhost:3456/.well-known/openid-configuration",
  );
});
