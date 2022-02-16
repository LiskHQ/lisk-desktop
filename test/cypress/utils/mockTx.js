const multiSignatureTxs = {
  RegisterSecondPassphraseTx: '{"moduleID":4,"assetID":0,"senderPublicKey":"6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef","nonce":"0n","fee":"314000n","signatures":["ce4d40ed844017a3daee95158cf5992a17c2044e1d5cd208c4938cb296344c5fa3277b1c68d4826b5be1b312d0c65b54af89f4e0abacb1ed71b4d0b7f3123900","ce4d40ed844017a3daee95158cf5992a17c2044e1d5cd208c4938cb296344c5fa3277b1c68d4826b5be1b312d0c65b54af89f4e0abacb1ed71b4d0b7f3123900",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["6b40b2c68d52b1532d0374a078974798cff0b59d0a409a8d574378fe2c69daef","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"],"optionalKeys":[]},"id":"d8b0425377062c6e1ac35383458de959b9cb9a931457dbe1fae161091d40a410"}',
  RegisterMultiSignGroupTx_second_sign: '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"9ae1254b9333e4a103dc2c49c596d7d55013d46e18043a95c1b9d1319d84c83c"}',
  RegisterMultiSignGroupTx_third_sign: '{"moduleID":4,"assetID":0,"senderPublicKey":"a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103","nonce":"0n","fee":"414000n","signatures":["89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","89c380e42226cbcdf8738390cdcd215521348e50f27e21767baa7f88d91d86fd87949d01b11f82afe865b025222f33d3c1c72a0b4f0122d9cc77513bbcc03b0d","336541438f0f81019c05af132600defea2f235525022e24a1b4184e71674233f7df7463ed739a4624dcd351b1e344707ea2a3953c003b7ecb1e5a632b58cae00",""],"asset":{"numberOfSignatures":2,"mandatoryKeys":["a04a60f5f3f9be3a15b121342ba81b7bd66d37e7f3e8cc4f7c03396bd9c1f103"],"optionalKeys":["0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a","86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19"]},"id":"f0ea4fb53ba647715fc5a11a36bbbe6edb8026e7b476b5b287e3a4452bef3289"}',
};

export default {
  multiSignatureTxs,
};
