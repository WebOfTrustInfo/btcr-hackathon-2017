#include <jansson.h>
#include <bitcoinrpc.h>
#include <string.h>

#define MAGIC_BTC_MAINNET 0x03
#define MAGIC_BTC_TESTNET 0x06

int main(int argc, char *argv[]) {

  /* 0. Expect a TXID */

  if (argc != 2) {

    printf("ERROR: Only %i arguments! Correct usage is '%s [txid]'\n",argc-1,argv[0]);
    exit(-1);

  }
  char *tx_id = argv[1];
  
  /* 1. Setup the RPC Calls */
  
  bitcoinrpc_cl_t *rpc_client;
  bitcoinrpc_method_t *rpc_method  = NULL;
  bitcoinrpc_resp_t *btcresponse  = NULL;
  bitcoinrpc_err_t btcerror;

  json_t *lu_response = NULL;
  json_t *lu_result = NULL;

  const char *converted_error;
  
  bitcoinrpc_global_init();

  /* 2. Startup the RPC client */
  
  /* CHANGE THIS TO YOUR LOGIN AND PASSWORD */

  rpc_client = bitcoinrpc_cl_init_params ("bitcoinrpc", "73bd45ba60ab8f9ff9846b6404769487", "127.0.0.1", 18332);

  if (rpc_client) {

    /* 3. Discover if we're on mainnet or testnet */
    
    rpc_method = bitcoinrpc_method_init(BITCOINRPC_METHOD_GETBLOCKCHAININFO);

    if (!rpc_method) {

      printf("ERROR: Unable to initialize getblockchaininfo method!\n");
      exit(-1);

    }

    btcresponse = bitcoinrpc_resp_init();
    if (!btcresponse) {

      printf("Error: Cannot initialize response object!");
      exit(-1);

    }

    bitcoinrpc_call(rpc_client, rpc_method, btcresponse, &btcerror);

    if (btcerror.code != BITCOINRPCE_OK) {

      printf("Error: getblockchaininfo error code %d [%s]\n", btcerror.code,btcerror.msg);
      exit(-1);

    }

    lu_response = bitcoinrpc_resp_get (btcresponse);

    if (json_is_null(lu_result)) {

      printf("Error: getblockchaininfo\n");
      printf ("%s\n", json_dumps (lu_response, JSON_INDENT(2)));
      exit(-1);
      
    }
    
    lu_result = json_object_get(lu_response,"result");

    int testnet = 0;

    const char *chain = 0;
    json_t *lu_chain = NULL;
    lu_chain = json_object_get(lu_result,"chain");
    chain = strdup(json_string_value(lu_chain));

    if (strcmp(chain,"test") == 0) {
      testnet = 1;
    }

    json_decref(lu_chain);
    json_decref(lu_result);
    json_decref(lu_response);

    /* 4. Retrieve the hash and height */

    rpc_method = bitcoinrpc_method_init(BITCOINRPC_METHOD_GETTRANSACTION);
    
    if (!rpc_method) {

      printf("ERROR: Unable to initialize gettransaction method!\n");
      exit(-1);

    }

    json_t *params = NULL;
    params = json_array();
    json_array_append_new(params,json_string(tx_id));

    if (bitcoinrpc_method_set_params(rpc_method, params) != BITCOINRPCE_OK) {

      fprintf (stderr, "Error: Could not set params for gettransaction");

    }

    json_decref(params);
    
    bitcoinrpc_call(rpc_client, rpc_method, btcresponse, &btcerror);

    if (btcerror.code != BITCOINRPCE_OK) {

      printf("Error: gettransaction error code %d [%s]\n", btcerror.code, btcerror.msg);
      exit(-1);

    }

    lu_response = bitcoinrpc_resp_get (btcresponse);
    lu_result = json_object_get(lu_response,"result");

    if (json_is_null(lu_result)) {

      printf("Error: gettransaction\n");
      printf ("%s\n", json_dumps (lu_response, JSON_INDENT(2)));
      exit(-1);
      
    }
    
    json_t *lu_hash = NULL;
    const char *blockhash = 0;    
    lu_hash = json_object_get(lu_result,"blockhash");
    blockhash = strdup(json_string_value(lu_hash));
    json_decref(lu_hash);

    json_t *lu_index = NULL;
    int blockindex = 0;
    lu_index = json_object_get(lu_result,"blockindex");
    blockindex = json_integer_value(lu_index);
    json_decref(lu_index);

    json_decref(lu_result);
    json_decref(lu_response);

    /* 5. Look up the blockheight */

    rpc_method = bitcoinrpc_method_init(BITCOINRPC_METHOD_GETBLOCK);
    
    if (!rpc_method) {

      printf("ERROR: Unable to initialize getblock method!\n");
      exit(-1);

    }

    params = json_array();
    json_array_append_new(params,json_string(blockhash));

    if (bitcoinrpc_method_set_params(rpc_method, params) != BITCOINRPCE_OK) {

      fprintf (stderr, "Error: Could not set params for getblock");

    }

    json_decref(params);
    
    bitcoinrpc_call(rpc_client, rpc_method, btcresponse, &btcerror);

    if (btcerror.code != BITCOINRPCE_OK) {

      printf("Error: getblock error code %d [%s]\n", btcerror.code, btcerror.msg);
      exit(-1);

    }

    lu_response = bitcoinrpc_resp_get (btcresponse);
    lu_result = json_object_get(lu_response,"result");

    if (json_is_null(lu_result)) {

      printf("Error: getblock\n");
      printf ("%s\n", json_dumps (lu_response, JSON_INDENT(2)));
      exit(-1);
      
    }
    

    json_t *lu_height = NULL;
    int blockheight = 0;
    lu_height = json_object_get(lu_result,"height");
    blockheight = json_integer_value(lu_height);
    json_decref(lu_height);

    json_t *lu_conf = NULL;
    int confirmations = 0;
    lu_conf = json_object_get(lu_result,"confirmations");
    confirmations = json_integer_value(lu_conf);
    json_decref(lu_conf);

    /* SHOULD THIS BE LARGER? */
    
    if (confirmations < 2) {

      printf("Error: Insufficient confirmations (%i) for block!",confirmations);
      exit(-1);

    }

    /* 6. Finally, do the conversion! */

    char encoded_txref[22] = {};

    int success = 0;

    success = btc_txref_encode(encoded_txref, MAGIC_BTC_TESTNET, blockheight,blockindex);

    printf("%s\n",encoded_txref);

    json_decref(lu_result);
    json_decref(lu_response);
    bitcoinrpc_method_free(rpc_method);
    
  } else {

    printf("ERROR: Failed to connect to server!\n");

  }

  bitcoinrpc_cl_free(rpc_client);
  bitcoinrpc_global_cleanup();
}
