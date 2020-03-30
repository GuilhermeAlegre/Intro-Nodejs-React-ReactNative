// Classe: IncidentController
// máximo 5 métodos por Controller

const connection = require('../database/connection');

module.exports = {

    async index(request, response) {
        // sao os query parms que de pode enviar usando os posntos de interrogação
        //seguem depois do ponto de interrugação 
        const { page = 1  } = request.query;

        //vai saber o nde casos existentes no banco de dados
        //como só quero um valor a linha abaixo me retorna um array entã0 o count fica [ ]
        const [count] = await connection('incidents').count();

        console.log(count)

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*', 
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        //normalmente o total de items é returnado pelo cabeçalho da resposta 
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {

        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        return response.json({ id });
    },

    async delete(request, response) {

        const { id } = request.params;
        const ong_id = request.headers.authorization;
        const incidents = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incidents.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }

        await connection('incidents').where('id', id).delete();
        return response.status(204).send();
    },
};