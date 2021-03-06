﻿/// <reference path="../defines/babylon.d.ts" />

// Creates the default scene of the editor
// Basically a skybox with planes and spheres and lights

function createDefaultScene(core) {
    var scene = core.currentScene;

    scene.imageProcessingConfiguration.contrast = 1.6;
	scene.imageProcessingConfiguration.exposure = 0.6;
	scene.imageProcessingConfiguration.toneMappingEnabled = true;

    // Light
    new BABYLON.PointLight("point", new BABYLON.Vector3(0, 40, 0), scene);

    // Environment Texture
    //var hdrTexture = new BABYLON.HDRCubeTexture("website/Tests/textures/environment.babylon.hdr", scene);

    // Skybox
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    //hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    //hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 1.0;
    hdrSkyboxMaterial.cameraExposure = 0.6;
    hdrSkyboxMaterial.cameraContrast = 1.6;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;

    // Create meshes
    var sphereGlass = BABYLON.Mesh.CreateSphere("sphereGlass", 48, 30.0, scene);
    sphereGlass.translate(new BABYLON.Vector3(1, 0, 0), -60);

    var sphereMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 48, 30.0, scene);
    sphereMetal.translate(new BABYLON.Vector3(1, 0, 0), 60);

    var spherePlastic = BABYLON.Mesh.CreateSphere("spherePlastic", 48, 30.0, scene);
    spherePlastic.translate(new BABYLON.Vector3(0, 0, 1), -60);

    var sphereNull = BABYLON.Mesh.CreateSphere("sphereNull", 48, 30.0, scene);
    sphereNull.translate(new BABYLON.Vector3(0, 0, 1), 60);

    var sphereNullInstance =sphereNull.createInstance("instance1");
    sphereNullInstance.translate(new BABYLON.Vector4(0, 0, 1), 120);

    var woodPlank = BABYLON.MeshBuilder.CreateBox("plane", { width: 65, height: 1, depth: 65 }, scene);

    woodPlank.isPickable = true;
    woodPlank.actionManager = new BABYLON.ActionManager(scene);
    var condition = new BABYLON.StateCondition(woodPlank.actionManager, woodPlank, "");
    woodPlank.actionManager.registerAction(
        new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnLeftPickTrigger, sphereGlass, "isVisible", null)
    ).then(
        new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnLeftPickTrigger, sphereGlass, "isVisible", condition)
    )

    // Create materials
    var glass = new BABYLON.PBRMaterial("glass", scene);
    //glass.reflectionTexture = hdrTexture;
    //glass.refractionTexture = hdrTexture;
    glass.linkRefractionWithTransparency = true;
    glass.indexOfRefraction = 0.52;
    glass.alpha = 0;
    glass.directIntensity = 0.0;
    glass.environmentIntensity = 0.5;
    glass.cameraExposure = 0.5;
    glass.cameraContrast = 1.7;
    glass.microSurface = 1;
    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glass.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    sphereGlass.material = glass;

    var metal = new BABYLON.PBRMaterial("metal", scene);
    //metal.reflectionTexture = hdrTexture;
    metal.directIntensity = 0.3;
    metal.environmentIntensity = 0.7;
    metal.cameraExposure = 0.55;
    metal.cameraContrast = 1.6;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    metal.albedoColor = new BABYLON.Color3(1, 1, 1);
    sphereMetal.material = metal;

    var plastic = new BABYLON.PBRMaterial("plastic", scene);
    //plastic.reflectionTexture = hdrTexture;
    plastic.directIntensity = 0.6;
    plastic.environmentIntensity = 0.7;
    plastic.cameraExposure = 0.6;
    plastic.cameraContrast = 1.6;
    plastic.microSurface = 0.96;
    plastic.albedoColor = new BABYLON.Color3(0.206, 0.94, 1);
    plastic.reflectivityColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    spherePlastic.material = plastic;

    var wood = new BABYLON.PBRMaterial("wood", scene);
    //wood.reflectionTexture = hdrTexture;
    wood.directIntensity = 1.5;
    wood.environmentIntensity = 0.5;
    wood.specularIntensity = 0.3;
    wood.cameraExposure = 0.9;
    wood.cameraContrast = 1.6;
    //wood.reflectivityTexture = new BABYLON.Texture("website/Tests/textures/reflectivity.png", scene);
    wood.useMicroSurfaceFromReflectivityMapAlpha = true;
    wood.albedoColor = BABYLON.Color3.White();
    //wood.albedoTexture = new BABYLON.Texture("website/Tests/textures/albedo.png", scene);
    woodPlank.material = wood;

    scene._addPendingData("website/textures/environment.dds");
    BABYLON.EDITOR.Tools.CreateFileFromURL("website/textures/environment.dds", function (file) {
        var texture = BABYLON.CubeTexture.CreateFromPrefilteredData("file:environment.dds", scene);
        texture.gammaSpace = false;

        hdrSkyboxMaterial.reflectionTexture = texture.clone();
        hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

        glass.reflectionTexture = texture;
        glass.refractionTexture = texture;
        metal.reflectionTexture = texture;
        plastic.reflectionTexture = texture;
        wood.reflectionTexture = texture;

        texture.name = texture.url = "environment.dds";
        hdrSkyboxMaterial.reflectionTexture.name = hdrSkyboxMaterial.reflectionTexture.url = "environment.dds";

        scene._removePendingData("website/textures/environment.dds");
    }, false);

    scene._addPendingData("website/Tests/textures/albedo.png");
    BABYLON.EDITOR.Tools.CreateFileFromURL("website/Tests/textures/albedo.png", function (file) {
        wood.albedoTexture = new BABYLON.Texture("file:albedo.png", scene);
        wood.albedoTexture.name = wood.albedoTexture.url = "albedo.png";

        scene._removePendingData("website/Tests/textures/albedo.png");
    }, true);

    scene._addPendingData("website/Tests/textures/reflectivity.png");
    BABYLON.EDITOR.Tools.CreateFileFromURL("website/Tests/textures/reflectivity.png", function (file) {
        wood.reflectivityTexture = new BABYLON.Texture("file:reflectivity.png", scene);
        wood.reflectivityTexture.name = wood.reflectivityTexture.url = "reflectivity.png";

        scene._removePendingData("website/Tests/textures/reflectivity.png");
    }, true);

    //editorMain._handleSceneLoaded()(null, scene);
};
