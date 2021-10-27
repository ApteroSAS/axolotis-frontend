import {Ammo, AmmoHelper} from "./AmmoLib";
import { FactoryAbstractInterface, loadComponent } from "@root/modules/core/assetsLoader/WebpackECSLoader";
import Component from "@root/modules/core/ecs/Component";
import { FrameLoop } from "@root/modules/core/FrameLoop";

export class AmmoPhysics implements Component{

  physicsUpdate = (world, timeStep)=>{
    //this.entityManager.PhysicsUpdate(world, timeStep);
  }
  public physicsWorld: any;

  async setupPhysics() {
    return new Promise(resolve => {
      AmmoHelper.init(()=>{
        // Physics configuration
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
        const broadphase = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
        this.physicsWorld.setGravity( new Ammo.btVector3( 0.0, -9.81, 0.0 ) );
        const fp = Ammo.addFunction(this.physicsUpdate);
        this.physicsWorld.setInternalTickCallback(fp);
        this.physicsWorld.getBroadphase().getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback());

        //Physics debug drawer
        //this.debugDrawer = new DebugDrawer(this.scene, this.physicsWorld);
        //this.debugDrawer.enable();
        resolve(true);
      });
    })
  }

  step(elapsedTime){
    this.physicsWorld.stepSimulation( elapsedTime, 10 );
  }

  getAmmo(){
    return Ammo;
  }

  getName(): string {
    return AmmoPhysics.name;
  }
}

export class Factory extends FactoryAbstractInterface<AmmoPhysics>{
  async create(config): Promise<AmmoPhysics> {
    let frameLoop = loadComponent<FrameLoop>("FrameLoop");
    const ammo = new AmmoPhysics();
    await ammo.setupPhysics();
    (await frameLoop).addCallback((delta)=>{
      ammo.step( delta*0.001);
    });
    return ammo;
  }
}
