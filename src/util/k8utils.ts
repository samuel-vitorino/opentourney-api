import * as k8s from '@kubernetes/client-node';
import app from '@src/server';

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sApps = kc.makeApiClient(k8s.AppsV1Api);

async function deleteDeployment(matchId: number) {
    try {
        await k8sApps.deleteNamespacedDeployment(`server-${matchId}-deployment`, 'default');
        console.log('Pod Deleted');
    } catch (err) {
        console.log('[ERROR] Pod Deleted');
        console.log(err.statusCode, err.body.message);
    }
}

async function getClusterIP(){
    await k8sApi.listNode().then(
        (response) => {
            console.log("AAAAAAAAAAA",response.body.items[0].status?.addresses);
            return response.body.items[0].status?.addresses!![2].address
        }
    );
}

async function createDeployment(matchId: number, matchConfig: string) {
    let port: number = 0;
    
    for (let i = 0; i < app.locals.gamePorts.length; i++) {
        const ports = app.locals.gamePorts[i];

        for (let p in ports) {
            if (!ports[p]) {
                port = parseInt(p);
            }
        }
    }
    
    try {
        await k8sApps.createNamespacedDeployment('default', {
            metadata: {
                name: `server-${matchId}-deployment`,
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: {
                        app: `server-${matchId}`,
                    },
                },
                template: {
                    metadata: {
                        labels: {
                            app: `server-${matchId}`,
                        },
                    },
                    spec: {
                        containers: [
                            {
                                name: `server-${matchId}-container`,
                                image: 'samuelvitorino/opentourney-server:latest',
                                volumeMounts: [{
                                    name: 'game-files-volume',
                                    mountPath: '/home/steam/csgo-dedicated'
                                }],
                                ports: [
                                    {
                                        containerPort: port,
                                        protocol: 'UDP'
                                    },
                                ],
                                env: [
                                    {
                                        name: "SRCDS_TOKEN",
                                        value: process.env.SRCDS_TOKEN
                                    },
                                    {
                                        name: "MATCH_CONFIG",
                                        value: matchConfig
                                    },
                                    {
                                        name: "EVENT_API_URL",
                                        value: "https://broadvision.eu.org/api"
                                    },
                                    {
                                        name: "SRCDS_PORT",
                                        value: port.toString()
                                    }
                                ]
                            },
                        ],
                        volumes: [{
                            name: 'game-files-volume',
                            persistentVolumeClaim: {
                                claimName: 'game-files-pvc', // Name of the persistent volume claim
                                readOnly: false
                            }
                        }]
                    },
                },
            },
        })
            .then(async (res) => {
                console.log('Deployment created');
                await createService(matchId, port);
                return `${getClusterIP()}:${port}`
            })
    } catch (err) {
        console.log('[ERROR] Deployment created');
        console.log(err.statusCode, err.body.message);
    }
}

async function createService(matchId: number, port: number): Promise<void> {
    let nodePort: number = 0
    try {
        await k8sApi.createNamespacedService('default', {
            metadata: {
                name: `game-${matchId}-service`,
            },
            spec: {
                selector: {
                    app: `server-${matchId}`,
                },
                ports: [
                    {
                        port: port,
                        nodePort: port,
                        protocol: 'UDP',
                    },
                ],
                type: 'NodePort',
            },
        }).then(
            (response) => {
                console.log('Service Created');
            }).catch(
                (err) => {
                    console.log('[ERROR] Service Created');
                    console.log(err.statusCode, err.body.message);
                },
            )
    } catch (err) {
        console.log('[ERROR] Service Created');
        console.log(err.statusCode, err.body.message);
    }
}


async function deleteService(matchId: number) {
    try {
        await k8sApi.deleteNamespacedService(`${matchId}-service`, 'default');
        console.log('Service Deleted');
    } catch (err) {
        console.log('[ERROR] Service Deleted');
        console.log(err.statusCode, err.body.message);
    }
}

async function deleteDeploymentAndService(matchId: number) {
    deleteDeployment(matchId);
    deleteService(matchId);
}



export default { createDeployment, deleteDeploymentAndService } as const;