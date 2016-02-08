/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';

User.find({}).removeAsync()
    .then(() => {
        User.createAsync({
            provider: 'local',
            name: 'Test User',
            email: 'test@example.com',
            password: 'test',
            todo: [{
                    name: 'Moving',
                    items: [
                        {
                            name: 'Buy ticket',
                            completed: true
                        },
                        {
                            name: 'Find job',
                            completed: false
                        }
                ]
              },
                {
                    name: 'Aamupala',
                    items: [
                        {
                            name: 'Kurkku',
                            completed: false
                        },
                        {
                            name: 'Leipä',
                            completed: true
                        },
                        {
                            name: 'Voi',
                            completed: true
                        }
                ]
              }]
        }, {
            provider: 'local',
            role: 'admin',
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin'
        });
    });