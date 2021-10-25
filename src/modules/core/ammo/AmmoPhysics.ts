import {Ammo, AmmoHelper} from "./AmmoLib";

export class AmmoPhysics {

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
    ammoPhysics.physicsWorld.stepSimulation( elapsedTime, 10 );
  }

  getAmmo(){
    return Ammo;
  }
}

export let ammoPhysics = new AmmoPhysics();
