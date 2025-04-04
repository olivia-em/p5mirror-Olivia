cd "/Users/olivialee/Documents/GitHub/p5mirror-Olivia/downloads/../p5projects"
#
echo unzip 1 "portals-CDwTbFgAL"
rm -rf "./portals-CDwTbFgAL"
mkdir "./portals-CDwTbFgAL"
pushd "./portals-CDwTbFgAL" > /dev/null
unzip -q "../../downloads/zips/portals-CDwTbFgAL"
popd > /dev/null
#
echo unzip 2 "ims02-olivia-DFjH5EV8I"
rm -rf "./ims02-olivia-DFjH5EV8I"
mkdir "./ims02-olivia-DFjH5EV8I"
pushd "./ims02-olivia-DFjH5EV8I" > /dev/null
unzip -q "../../downloads/zips/ims02-olivia-DFjH5EV8I"
popd > /dev/null
#
echo unzip 3 "tracery template copy-tcd70av3o"
rm -rf "./tracery template copy-tcd70av3o"
mkdir "./tracery template copy-tcd70av3o"
pushd "./tracery template copy-tcd70av3o" > /dev/null
unzip -q "../../downloads/zips/tracery template copy-tcd70av3o"
popd > /dev/null
#
echo unzip 4 "bulleTimbre-board-2pD43zzAC"
rm -rf "./bulleTimbre-board-2pD43zzAC"
mkdir "./bulleTimbre-board-2pD43zzAC"
pushd "./bulleTimbre-board-2pD43zzAC" > /dev/null
unzip -q "../../downloads/zips/bulleTimbre-board-2pD43zzAC"
popd > /dev/null
#
echo unzip 5 "vector arrow copy-Q8vzZpAZp"
rm -rf "./vector arrow copy-Q8vzZpAZp"
mkdir "./vector arrow copy-Q8vzZpAZp"
pushd "./vector arrow copy-Q8vzZpAZp" > /dev/null
unzip -q "../../downloads/zips/vector arrow copy-Q8vzZpAZp"
popd > /dev/null
#
echo unzip 6 "Text in 3D copy-PCqTAKnLM"
rm -rf "./Text in 3D copy-PCqTAKnLM"
mkdir "./Text in 3D copy-PCqTAKnLM"
pushd "./Text in 3D copy-PCqTAKnLM" > /dev/null
unzip -q "../../downloads/zips/Text in 3D copy-PCqTAKnLM"
popd > /dev/null
#
echo unzip 7 "Text in 3D copy copy-b9zSWwvDk"
rm -rf "./Text in 3D copy copy-b9zSWwvDk"
mkdir "./Text in 3D copy copy-b9zSWwvDk"
pushd "./Text in 3D copy copy-b9zSWwvDk" > /dev/null
unzip -q "../../downloads/zips/Text in 3D copy copy-b9zSWwvDk"
popd > /dev/null
#
echo unzip 8 "Text in 3D copy copy-gzMBNSyM-"
rm -rf "./Text in 3D copy copy-gzMBNSyM-"
mkdir "./Text in 3D copy copy-gzMBNSyM-"
pushd "./Text in 3D copy copy-gzMBNSyM-" > /dev/null
unzip -q "../../downloads/zips/Text in 3D copy copy-gzMBNSyM-"
popd > /dev/null
#
echo unzip 9 "Sampler_more_samples-gieEY0FBS"
rm -rf "./Sampler_more_samples-gieEY0FBS"
mkdir "./Sampler_more_samples-gieEY0FBS"
pushd "./Sampler_more_samples-gieEY0FBS" > /dev/null
unzip -q "../../downloads/zips/Sampler_more_samples-gieEY0FBS"
popd > /dev/null
#
echo unzip 10 "bulleTimbre board-tsqr57GS5"
rm -rf "./bulleTimbre board-tsqr57GS5"
mkdir "./bulleTimbre board-tsqr57GS5"
pushd "./bulleTimbre board-tsqr57GS5" > /dev/null
unzip -q "../../downloads/zips/bulleTimbre board-tsqr57GS5"
popd > /dev/null
#
echo unzip 11 "Effects copy-xgvMNNad9"
rm -rf "./Effects copy-xgvMNNad9"
mkdir "./Effects copy-xgvMNNad9"
pushd "./Effects copy-xgvMNNad9" > /dev/null
unzip -q "../../downloads/zips/Effects copy-xgvMNNad9"
popd > /dev/null
#
echo unzip 12 "DRUMPADS copy-kAXseyzEi"
rm -rf "./DRUMPADS copy-kAXseyzEi"
mkdir "./DRUMPADS copy-kAXseyzEi"
pushd "./DRUMPADS copy-kAXseyzEi" > /dev/null
unzip -q "../../downloads/zips/DRUMPADS copy-kAXseyzEi"
popd > /dev/null

cd ..
# remove redundant p5.js p5.sound.min.js
rm -f p5projects/*/p5.*
# sync last_updatedAt.txt
cd downloads/json
if [ -e pending_updatedAt.txt ]; then
  rm -f last_updatedAt.txt
  mv pending_updatedAt.txt last_updatedAt.txt
fi